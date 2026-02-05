import { prisma } from '../config/database';
import { OAuthClient, Prisma } from '../../generated/prisma/client';

export class OAuthClientRepository {
    async create(data: Prisma.OAuthClientCreateInput): Promise<OAuthClient> {
        return await prisma.oAuthClient.create({ data });
    }

    async findById(id: string): Promise<OAuthClient | null> {
        return await prisma.oAuthClient.findUnique({
            where: { id },
        });
    }

    async findActiveById(id: string): Promise<OAuthClient | null> {
        return await prisma.oAuthClient.findFirst({
            where: {
                id,
                isActive: true,
            },
        });
    }

    async update(id: string, data: Prisma.OAuthClientUpdateInput): Promise<OAuthClient> {
        return await prisma.oAuthClient.update({
            where: { id },
            data,
        });
    }
}
