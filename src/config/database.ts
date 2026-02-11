import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

declare global {
  const prisma: PrismaClient | undefined;
}

/**
 * REVIEW: [TIP] I love to parse environment variables using zod
 * This makes process.env strongly typed, and if you dont have the variables you
 * expect, it will throw an error at runtime, making it easier to debug missing .env
 *
 * @see: https://env.t3.gg/docs/core
 */
const connectionString = `${process.env.DATABASE_URL}`;

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

/**
 * REVIEW: I dont like to do things this way
 * usually setting global params leads to a lot of hard to debug issues
 * avoid doing it when you work on a production environment
 */
const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
