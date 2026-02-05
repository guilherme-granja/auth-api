import { prisma } from '../config/database';
import {OAuthAccessToken, OAuthRefreshToken, Prisma} from '../../generated/prisma/client';

export type RefreshTokenWithAccessToken = OAuthRefreshToken & {
    accessToken: OAuthAccessToken | null;
};

export class OAuthRefreshTokenRepository {
    async create(data: Prisma.OAuthRefreshTokenCreateInput): Promise<OAuthRefreshToken> {
        return await prisma.oAuthRefreshToken.create({ data });
    }

    async findByJti(jti: string): Promise<RefreshTokenWithAccessToken | null> {
        return await prisma.oAuthRefreshToken.findUnique({
            where: { jti },
            include: {
                accessToken: true,
            },
        });
    }

    async findValidByJti(jti: string): Promise<RefreshTokenWithAccessToken | null> {
        return await prisma.oAuthRefreshToken.findFirst({
            where: {
                jti,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                accessToken: true,
            },
        });
    }

    async revoke(id: string): Promise<void> {
        await prisma.oAuthRefreshToken.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }

    async revokeByJti(jti: string): Promise<void> {
        await prisma.oAuthRefreshToken.update({
            where: { jti },
            data: { revokedAt: new Date() },
        });
    }

    async revokeByAccessTokenId(accessTokenId: string): Promise<void> {
        await prisma.oAuthRefreshToken.updateMany({
            where: {
                accessTokenId,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });
    }
}
