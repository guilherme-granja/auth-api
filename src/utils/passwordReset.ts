import crypto from 'crypto';

export class PasswordResetUtils {
    private static readonly TOKEN_LENGTH = 32;

    static generateToken(): string {
        return crypto.randomBytes(this.TOKEN_LENGTH).toString('hex');
    }

    static calculateExpiry(): Date {
        const hours = parseInt(process.env.RESET_TOKEN_EXPIRY_HOURS || '1', 10);
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }

    static isExpired(expiry: Date | null): boolean {
        if (!expiry) return true;
        return new Date() > expiry;
    }
}