import { GrantInterface, GrantRequest, TokenResponse } from './GrantInterface';
import { OAuthAccessTokenRepository } from '../../../repositories/OAuthAccessTokenRepository';
import { OAuthRefreshTokenRepository } from '../../../repositories/OAuthRefreshTokenRepository';
import { JwtUtils } from '../../../utils/jwt';
import { ScopeValidatorUtils } from '../../../utils/oauth/scopeValidator';
import { InvalidGrantException } from '../../../exceptions/oauth/InvalidGrantException';
import { InvalidRequestException } from '../../../exceptions/oauth/InvalidRequestException';
import {RefreshTokenParams} from "../../../dtos/oauth/RefreshTokenParams";

export class RefreshTokenGrant implements GrantInterface {
    readonly identifier = 'refresh_token';

    private accessTokenRepository: OAuthAccessTokenRepository;
    private refreshTokenRepository: OAuthRefreshTokenRepository;
    private readonly accessTokenTTL: number;
    private readonly refreshTokenTTL: number;

    constructor(
        accessTokenRepository?: OAuthAccessTokenRepository,
        refreshTokenRepository?: OAuthRefreshTokenRepository
    ) {
        this.accessTokenRepository = accessTokenRepository || new OAuthAccessTokenRepository();
        this.refreshTokenRepository = refreshTokenRepository || new OAuthRefreshTokenRepository();
        this.accessTokenTTL = parseInt(process.env.OAUTH_ACCESS_TOKEN_TTL || '900', 10);
        this.refreshTokenTTL = parseInt(process.env.OAUTH_REFRESH_TOKEN_TTL || '604800', 10);
    }

    async handle(request: GrantRequest, params: RefreshTokenParams): Promise<TokenResponse> {
        const { client, scopes } = request;
        const { refresh_token } = params;

        if (!refresh_token) {
            throw new InvalidRequestException('Refresh token is required');
        }

        const decoded = JwtUtils.verifyRefreshToken(refresh_token);

        if (!decoded) {
            throw new InvalidGrantException('Invalid refresh token');
        }

        const storedRefreshToken = await this.refreshTokenRepository.findValidByJti(decoded.jti);

        if (!storedRefreshToken) {
            throw new InvalidGrantException('Refresh token has been revoked or expired');
        }

        if (storedRefreshToken.clientId !== client.id) {
            throw new InvalidGrantException('Refresh token was not issued to this client');
        }

        const oldAccessToken = storedRefreshToken.accessToken;

        await this.refreshTokenRepository.revoke(storedRefreshToken.id);
        if (oldAccessToken) {
            await this.accessTokenRepository.revoke(oldAccessToken.id);
        }

        const originalScopes = oldAccessToken?.scopes || [];

        let newScopes = scopes.length > 0
            ? ScopeValidatorUtils.validate(scopes)
            : originalScopes;

        newScopes = newScopes.filter(s => originalScopes.includes(s));

        const accessTokenJti = JwtUtils.generateTokenId();
        const accessTokenExpiresAt = new Date(Date.now() + this.accessTokenTTL * 1000);

        const newAccessToken = await this.accessTokenRepository.create({
            jti: accessTokenJti,
            scopes: newScopes,
            expiresAt: accessTokenExpiresAt,
            client: {
                connect: { id: client.id },
            },
            ...(oldAccessToken?.userId && {
                user: {
                    connect: { id: oldAccessToken.userId },
                },
            }),
        });

        const accessToken = JwtUtils.generateAccessToken(
            {
                jti: accessTokenJti,
                sub: oldAccessToken?.userId || undefined,
                client_id: client.id,
                scope: ScopeValidatorUtils.toString(newScopes),
            },
            this.accessTokenTTL
        );

        const refreshTokenJti = JwtUtils.generateTokenId();
        const refreshTokenExpiresAt = new Date(Date.now() + this.refreshTokenTTL * 1000);

        await this.refreshTokenRepository.create({
            jti: refreshTokenJti,
            expiresAt: refreshTokenExpiresAt,
            accessToken: {
                connect: { id: newAccessToken.id },
            },
            client: {
                connect: { id: client.id },
            },
        });

        const newRefreshToken = JwtUtils.generateRefreshToken(
            {
                jti: refreshTokenJti,
                access_token_id: newAccessToken.id,
                client_id: client.id,
            },
            this.refreshTokenTTL
        );

        return {
            token_type: 'Bearer',
            access_token: accessToken,
            expires_in: this.accessTokenTTL,
            refresh_token: newRefreshToken,
            scope: ScopeValidatorUtils.toString(newScopes),
        };
    }
}