import {OAuthClientRepository} from "../../../repositories/OAuthClientRepository";
import {OAuthAccessTokenRepository} from "../../../repositories/OAuthAccessTokenRepository";
import {OAuthAuthCodeRepository} from "../../../repositories/OAuthAuthCodeRepository";
import {GrantInterface, TokenResponse} from "./GrantInterface";
import {ClientCredentialsGrant} from "./ClientCredentialsGrant";
import {AuthorizationCodeGrant} from "./AuthorizationCodeGrant";
import {RefreshTokenGrant} from "./RefreshTokenGrant";
import {InvalidRequestException} from "../../../exceptions/oauth/InvalidRequestException";
import {ScopeValidatorUtils} from "../../../utils/oauth/scopeValidator";
import {InvalidClientException} from "../../../exceptions/oauth/InvalidClientException";
import {UnauthorizedClientException} from "../../../exceptions/oauth/UnauthorizedClientException";
import {OpaqueTokenGeneratorUtils} from "../../../utils/oauth/opaqueTokenGenerator";
import {HashUtils} from "../../../utils/hash";
import {JwtUtils} from "../../../utils/jwt";

export class OAuthServer {
    private clientRepository: OAuthClientRepository;
    private accessTokenRepository: OAuthAccessTokenRepository;
    private authCodeRepository: OAuthAuthCodeRepository;
    private grants: Map<string, GrantInterface>;

    constructor() {
        this.clientRepository = new OAuthClientRepository();
        this.accessTokenRepository = new OAuthAccessTokenRepository();
        this.authCodeRepository = new OAuthAuthCodeRepository();

        this.grants = new Map();
        this.registerGrant(new ClientCredentialsGrant());
        this.registerGrant(new AuthorizationCodeGrant());
        this.registerGrant(new RefreshTokenGrant());
    }

    registerGrant(grant: GrantInterface): void {
        this.grants.set(grant.identifier, grant);
    }

    async handleTokenRequest(params: TokenRequestParams): Promise<TokenResponse> {
        const { grant_type, client_id, client_secret, scope, ...otherParams } = params;

        if (!grant_type) {
            throw new InvalidRequestException('grant_type is required');
        }

        const grant = this.grants.get(grant_type);
        if (!grant) {
            throw new InvalidRequestException(`Unsupported grant type: ${grant_type}`);
        }

        const client = await this.authenticateClient(client_id, client_secret, grant_type);
        const scopes = scope ? ScopeValidatorUtils.parse(scope) : [];

        return await grant.handle(
            { client, scopes },
            otherParams
        );
    }

    async handleAuthorizationRequest(
        params: AuthorizationRequestParams,
        userId: string
    ): Promise<AuthorizationResponse> {
        const {
            client_id,
            redirect_uri,
            response_type,
            scope,
            state,
            code_challenge,
            code_challenge_method,
        } = params;

        if (response_type !== 'code') {
            throw new InvalidRequestException('response_type must be "code"');
        }

        const client = await this.clientRepository.findActiveById(client_id);
        if (!client) {
            throw new InvalidClientException('Unknown client');
        }

        if (!client.grants.includes('authorization_code')) {
            throw new UnauthorizedClientException();
        }

        if (!redirect_uri) {
            throw new InvalidRequestException('redirect_uri is required');
        }

        if (!client.redirectUris.includes(redirect_uri)) {
            throw new InvalidRequestException('Invalid redirect_uri');
        }

        if (!client.isConfidential) {
            if (!code_challenge) {
                throw new InvalidRequestException('PKCE code_challenge is required for public clients');
            }
        }

        if (code_challenge && code_challenge_method !== 'S256' && code_challenge_method !== 'plain') {
            throw new InvalidRequestException('code_challenge_method must be "S256" or "plain"');
        }

        const requestedScopes = scope ? ScopeValidatorUtils.parse(scope) : [];
        const validScopes = ScopeValidatorUtils.validate(requestedScopes);

        const code = OpaqueTokenGeneratorUtils.generate(32);
        const hashedCode = OpaqueTokenGeneratorUtils.hash(code);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.authCodeRepository.create({
            code: hashedCode,
            redirectUri: redirect_uri,
            scopes: validScopes,
            codeChallenge: code_challenge || null,
            codeChallengeMethod: code_challenge ? (code_challenge_method || 'plain') : null,
            expiresAt,
            client: {
                connect: { id: client.id },
            },
            user: {
                connect: { id: userId },
            },
        });

        return {
            code,
            state,
            redirect_uri,
        };
    }

    async validateAccessToken(token: string): Promise<ValidatedToken | null> {
        const decoded = JwtUtils.verifyAccessToken(token);

        if (!decoded) {
            return null;
        }

        const storedToken = await this.accessTokenRepository.findValidByJti(decoded.jti);

        if (!storedToken) {
            return null;
        }

        return {
            clientId: storedToken.clientId,
            userId: storedToken.userId,
            scopes: storedToken.scopes,
            expiresAt: storedToken.expiresAt,
        };
    }

    async revokeAllUserTokens(userId: string): Promise<void> {
        await this.accessTokenRepository.revokeAllByUserId(userId);
    }

    private async authenticateClient(
        clientId: string,
        clientSecret: string | undefined,
        grantType: string
    ): Promise<any> {
        if (!clientId) {
            throw new InvalidClientException('client_id is required');
        }

        const client = await this.clientRepository.findActiveById(clientId);

        if (!client) {
            throw new InvalidClientException('Unknown client');
        }

        // Check if client supports this grant type
        if (!client.grants.includes(grantType)) {
            throw new UnauthorizedClientException();
        }

        // Confidential clients must provide valid secret
        if (client.isConfidential) {
            if (!clientSecret) {
                throw new InvalidClientException('client_secret is required');
            }

            const isValidSecret = await HashUtils.compare(clientSecret, client.secret!);
            if (!isValidSecret) {
                throw new InvalidClientException('Invalid client credentials');
            }
        }

        return client;
    }
}

interface TokenRequestParams {
    grant_type: string;
    client_id: string;
    client_secret?: string;
    scope?: string;
    [key: string]: any;
}

interface AuthorizationRequestParams {
    client_id: string;
    redirect_uri: string;
    response_type: string;
    scope?: string;
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
}

interface AuthorizationResponse {
    code: string;
    state?: string;
    redirect_uri: string;
}

interface ValidatedToken {
    clientId: string;
    userId: string | null;
    scopes: string[];
    expiresAt: Date;
}

export { TokenRequestParams, AuthorizationRequestParams, AuthorizationResponse, ValidatedToken };