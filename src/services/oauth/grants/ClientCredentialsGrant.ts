import { GrantInterface, GrantRequest, TokenResponse } from './GrantInterface';
import { OAuthAccessTokenRepository } from '../../../repositories/OAuthAccessTokenRepository';
import { JwtUtils } from '../../../utils/jwt';
import { ScopeValidatorUtils } from '../../../utils/oauth/scopeValidator';

export class ClientCredentialsGrant implements GrantInterface {
    readonly identifier = 'client_credentials';

    private accessTokenRepository: OAuthAccessTokenRepository;
    private readonly accessTokenTTL: number;

    constructor(
        accessTokenRepository?: OAuthAccessTokenRepository,
        accessTokenTTL?: number
    ) {
        this.accessTokenRepository = accessTokenRepository || new OAuthAccessTokenRepository();
        this.accessTokenTTL = accessTokenTTL || parseInt(process.env.OAUTH_ACCESS_TOKEN_TTL || '3600', 10);
    }

    async handle(request: GrantRequest): Promise<TokenResponse> {
        const { client, scopes } = request;

        const validScopes = ScopeValidatorUtils.validate(scopes);

        const jti = JwtUtils.generateTokenId();
        const expiresAt = new Date(Date.now() + this.accessTokenTTL * 1000);

        await this.accessTokenRepository.create({
            jti,
            scopes: validScopes,
            expiresAt,
            client: {
                connect: { id: client.id },
            },
        });

        const accessToken = JwtUtils.generateAccessToken(
            {
                jti,
                client_id: client.id,
                scope: ScopeValidatorUtils.toString(validScopes),
            },
            this.accessTokenTTL
        );

        return {
            token_type: 'Bearer',
            access_token: accessToken,
            expires_in: this.accessTokenTTL,
            scope: ScopeValidatorUtils.toString(validScopes),
        };
    }
}