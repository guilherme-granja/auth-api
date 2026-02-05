import { GrantInterface, GrantRequest, TokenResponse } from './GrantInterface';
import { OAuthAccessTokenRepository } from '../../../repositories/OAuthAccessTokenRepository';
import { OAuthRefreshTokenRepository } from '../../../repositories/OAuthRefreshTokenRepository';
import { OAuthAuthCodeRepository } from '../../../repositories/OAuthAuthCodeRepository';
import { JwtUtils } from '../../../utils/jwt';
import { OpaqueTokenGeneratorUtils } from '../../../utils/oauth/opaqueTokenGenerator';
import { PKCEUtils } from '../../../utils/oauth/pkce';
import { ScopeValidatorUtils } from '../../../utils/oauth/scopeValidator';
import { InvalidGrantException } from '../../../exceptions/oauth/InvalidGrantException';
import { InvalidRequestException } from '../../../exceptions/oauth/InvalidRequestException';

export class AuthorizationCodeGrant implements GrantInterface {
    readonly identifier = 'authorization_code';

    private accessTokenRepository: OAuthAccessTokenRepository;
    private refreshTokenRepository: OAuthRefreshTokenRepository;
    private authCodeRepository: OAuthAuthCodeRepository;
    private accessTokenTTL: number;
    private refreshTokenTTL: number;

    constructor(
        accessTokenRepository?: OAuthAccessTokenRepository,
        refreshTokenRepository?: OAuthRefreshTokenRepository,
        authCodeRepository?: OAuthAuthCodeRepository
    ) {
        this.accessTokenRepository = accessTokenRepository || new OAuthAccessTokenRepository();
        this.refreshTokenRepository = refreshTokenRepository || new OAuthRefreshTokenRepository();
        this.authCodeRepository = authCodeRepository || new OAuthAuthCodeRepository();
        this.accessTokenTTL = parseInt(process.env.OAUTH_ACCESS_TOKEN_TTL || '900', 10);
        this.refreshTokenTTL = parseInt(process.env.OAUTH_REFRESH_TOKEN_TTL || '604800', 10);
    }

    async handle(request: GrantRequest, params: AuthCodeParams): Promise<TokenResponse> {
        const { client } = request;
        const { code, redirect_uri, code_verifier } = params;

        if (!code) {
            throw new InvalidRequestException('Authorization code is required');
        }

        if (!redirect_uri) {
            throw new InvalidRequestException('Redirect URI is required');
        }

        const hashedCode = OpaqueTokenGeneratorUtils.hash(code);
        const authCode = await this.authCodeRepository.findValidCode(hashedCode);

        if (!authCode) {
            throw new InvalidGrantException('Invalid or expired authorization code');
        }

        if (authCode.clientId !== client.id) {
            throw new InvalidGrantException('Authorization code was not issued to this client');
        }

        if (authCode.redirectUri !== redirect_uri) {
            throw new InvalidGrantException('Redirect URI mismatch');
        }

        if (authCode.codeChallenge) {
            if (!code_verifier) {
                throw new InvalidRequestException('Code verifier is required');
            }

            const isValidPKCE = PKCEUtils.verifyCodeChallenge(
                code_verifier,
                authCode.codeChallenge,
                authCode.codeChallengeMethod as 'plain' | 'S256'
            );

            if (!isValidPKCE) {
                throw new InvalidGrantException('Invalid code verifier');
            }
        }

        await this.authCodeRepository.revoke(authCode.id);

        const accessTokenJti = JwtUtils.generateTokenId();
        const accessTokenExpiresAt = new Date(Date.now() + this.accessTokenTTL * 1000);

        const storedAccessToken = await this.accessTokenRepository.create({
            jti: accessTokenJti,
            scopes: authCode.scopes,
            expiresAt: accessTokenExpiresAt,
            client: {
                connect: { id: client.id },
            },
            user: {
                connect: { id: authCode.userId },
            },
        });

        const accessToken = JwtUtils.generateAccessToken(
            {
                jti: accessTokenJti,
                sub: authCode.userId,
                client_id: client.id,
                scope: ScopeValidatorUtils.toString(authCode.scopes),
            },
            this.accessTokenTTL
        );

        let refreshToken: string | undefined;

        if (authCode.scopes.includes('offline_access')) {
            const refreshTokenJti = JwtUtils.generateTokenId();
            const refreshTokenExpiresAt = new Date(Date.now() + this.refreshTokenTTL * 1000);

            await this.refreshTokenRepository.create({
                jti: refreshTokenJti,
                expiresAt: refreshTokenExpiresAt,
                accessToken: {
                    connect: { id: storedAccessToken.id },
                },
                client: {
                    connect: { id: client.id },
                },
            });

            refreshToken = JwtUtils.generateRefreshToken(
                {
                    jti: refreshTokenJti,
                    access_token_id: storedAccessToken.id,
                    client_id: client.id,
                },
                this.refreshTokenTTL
            );
        }

        return {
            token_type: 'Bearer',
            access_token: accessToken,
            expires_in: this.accessTokenTTL,
            refresh_token: refreshToken,
            scope: ScopeValidatorUtils.toString(authCode.scopes),
        };
    }
}

interface AuthCodeParams {
    code: string;
    redirect_uri: string;
    code_verifier?: string;
}