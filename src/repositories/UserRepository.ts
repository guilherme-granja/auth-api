import { prisma } from '../config/database';
import { User, Prisma } from '../../generated/prisma/client';

export class UserRepository {
    async create(data: Prisma.UserCreateInput): Promise<any> {
        return await prisma.user.create({
            data
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email }
        });
    }
}