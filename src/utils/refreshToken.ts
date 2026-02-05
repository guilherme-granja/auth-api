import crypto from 'crypto';

export class RefreshTokenUtils {
    private static readonly TOKEN_LENGTH = 64;

    private static getExpiresInDays(): number {
        const days = process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS;

        return days ? parseInt(days, 10) : 7;
    }

    static generateToken(): string {
        return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex');
    }

    static calculateExpiresAt(): Date {
        const now = new Date();
        const days = this.getExpiresInDays();

        return new Date(now.getTime() + days * 24 * 60 * 60 * 100);
    }

    static isExpired(expiresAt: Date): boolean {
        return new Date() > expiresAt;
    }
}