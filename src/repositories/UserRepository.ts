import { prisma } from '../config/database';
import { User, Prisma } from '../../generated/prisma/client';

export class UserRepository {
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({
            data
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data: data
        });
    }

    async setResetToken(
        id: string,
        resetToken: string,
        resetTokenExpiry: Date
    ): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });
    }

    async findByResetToken(resetToken: string): Promise<User | null> {
        return await prisma.user.findFirst({
            where: { resetToken },
        });
    }

    async clearResetToken(id: string): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data: {
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
    }
}