import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

declare global {
    const prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`

const createPrismaClient = () => {
    const adapter = new PrismaPg({ connectionString })
    return new PrismaClient({ adapter })
};

const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export { prisma }