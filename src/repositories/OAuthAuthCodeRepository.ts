import { prisma } from '../config/database';
import { OAuthAuthCode, Prisma } from '../../generated/prisma/client';

export class OAuthAuthCodeRepository {
    async create(data: Prisma.OAuthAuthCodeCreateInput): Promise<OAuthAuthCode> {
        return await prisma.oAuthAuthCode.create({ data });
    }

    async findByCode(code: string): Promise<OAuthAuthCode | null> {
        return await prisma.oAuthAuthCode.findUnique({
            where: { code },
        });
    }

    async findValidCode(code: string): Promise<OAuthAuthCode | null> {
        return await prisma.oAuthAuthCode.findFirst({
            where: {
                code,
                revokedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
    }

    async revoke(id: string): Promise<void> {
        await prisma.oAuthAuthCode.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }

    async deleteExpired(): Promise<number> {
        const result = await prisma.oAuthAuthCode.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        return result.count;
    }
}