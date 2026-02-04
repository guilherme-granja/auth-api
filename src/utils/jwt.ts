import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import {GeneratedToken} from "../dtos/jwt/GeneratedToken";
export class JwtUtils {
    private static readonly DEFAULT_EXPIRES_IN_SECONDS = 3600;

    private static getSecret(): string {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }

        return secret;
    }

    private static getExpiresInSeconds(): number {
        const expiresIn = process.env.JWT_EXPIRES_IN_SECONDS;

        if (!expiresIn) {
            return this.DEFAULT_EXPIRES_IN_SECONDS;
        }

        const parsed = parseInt(expiresIn, 10);

        if (isNaN(parsed)) {
            return this.DEFAULT_EXPIRES_IN_SECONDS;
        }

        return parsed;
    }

    private static calculateExpiresAt(): Date {
        const expiresInMs = this.getExpiresInSeconds() * 1000;

        return new Date(Date.now() + expiresInMs);
    }

    static generateAccessToken(payload: { sub: string }): GeneratedToken {
        const options: SignOptions = {
            expiresIn: this.getExpiresInSeconds(),
        };
        const expiresInSeconds = this.getExpiresInSeconds();
        const expiresAt = this.calculateExpiresAt();

        const token = jwt.sign(payload, this.getSecret(), options);

        return {
            token,
            expiresAt
        };
    }

    static verifyToken(token: string): JwtPayload {
        const decoded = jwt.verify(token, this.getSecret());

        if (typeof decoded === 'string') {
            throw new Error('Invalid token format');
        }

        return decoded;
    }
}