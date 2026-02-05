import crypto from 'crypto';

export class PKCEUtils {
    static generateCodeVerifier(): string {
        return crypto
            .randomBytes(32)
            .toString('base64url');
    }

    static createCodeChallenge(verifier: string, method: 'plain' | 'S256' = 'S256'): string {
        if (method === 'plain') {
            return verifier;
        }

        return crypto
            .createHash('sha256')
            .update(verifier)
            .digest('base64url');
    }

    static verifyCodeChallenge(
        verifier: string,
        challenge: string,
        method: 'plain' | 'S256'
    ): boolean {
        const computedChallenge = this.createCodeChallenge(verifier, method);

        try {
            return crypto.timingSafeEqual(
                Buffer.from(computedChallenge),
                Buffer.from(challenge)
            );
        } catch {
            return false;
        }
    }
}