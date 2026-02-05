import crypto from 'crypto';

export class OpaqueTokenGeneratorUtils {
    static generate(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    static hash(token: string): string {
        return crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
    }

    static verify(token: string, hash: string): boolean {
        const tokenHash = this.hash(token);
        return crypto.timingSafeEqual(
            Buffer.from(tokenHash),
            Buffer.from(hash)
        );
    }
}