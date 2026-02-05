import { prisma } from '../config/database';
import {Prisma, RefreshToken} from '../../generated/prisma/client';

export class RefreshTokenRepository {
    async create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
        return await prisma.refreshToken.create({
            data,
        });
    }

    async findByToken(token: string): Promise<RefreshToken | null> {
        return await prisma.refreshToken.findUnique({
            where: { token }
        });
    }

    async deleteByToken(token: string): Promise<void> {
        await prisma.refreshToken.delete({
            where: { token }
        });
    }

    async deleteAllByUserId(userId: string): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }

    async deleteExpired(): Promise<number> {
        const result = await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            }
        });

        return result.count;
    }

    async countByUserId(userId: string): Promise<number> {
        return await prisma.refreshToken.count({
            where: {
                userId,
                expiresAt: {
                    gt: new Date(),  // Only count non-expired
                },
            },
        });
    }
}