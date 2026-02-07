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

    async revokeAllUserTokens(userId: string): Promise<void> {
        await prisma.refreshToken.updateMany({
            where: { userId, revoked: false },
            data: {
                revoked: true,
                revokedAt: new Date(),
            }
        });
    }

    async revokeById(id: string): Promise<void> {
        await prisma.refreshToken.update({
            where: { id },
            data: {
                revoked: true,
                revokedAt: new Date(),
            }
        });
    }
}