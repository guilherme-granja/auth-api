import { prisma } from '../config/database';
import { OAuthAccessToken, Prisma } from '../../generated/prisma/client';

export class OAuthAccessTokenRepository {
    async create(data: Prisma.OAuthAccessTokenCreateInput): Promise<OAuthAccessToken> {
        return await prisma.oAuthAccessToken.create({ data });
    }

    async findByJti(jti: string): Promise<OAuthAccessToken | null> {
        return await prisma.oAuthAccessToken.findUnique({
            where: { jti },
        });
    }

    async findValidByJti(jti: string): Promise<OAuthAccessToken | null> {
        return await prisma.oAuthAccessToken.findFirst({
            where: {
                jti,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
    }

    async revoke(id: string): Promise<void> {
        await prisma.oAuthAccessToken.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }

    async revokeByJti(jti: string): Promise<void> {
        await prisma.oAuthAccessToken.update({
            where: { jti },
            data: { revokedAt: new Date() },
        });
    }

    async revokeAllByUserId(userId: string): Promise<number> {
        const result = await prisma.oAuthAccessToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });
        return result.count;
    }

    async revokeAllByClientId(clientId: string): Promise<number> {
        const result = await prisma.oAuthAccessToken.updateMany({
            where: {
                clientId,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });
        return result.count;
    }

    async deleteExpired(): Promise<number> {
        const result = await prisma.oAuthAccessToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
        return result.count;
    }
}
