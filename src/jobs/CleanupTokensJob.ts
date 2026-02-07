import { prisma } from '../config/database';

export class CleanupTokensJob {
    private readonly RETENTION_DAYS = 30;

    async run(): Promise<void> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS)

        const result = await prisma.refreshToken.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { revoked: true }
                ]
            }
        });

        console.log(`✅ Token cleanup: Deleted ${result.count} tokens`);
    }
}