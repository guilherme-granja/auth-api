import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import crypto from 'crypto';
import {AccessTokenPayload} from "../dtos/jwt/AccessTokenPayload";
import {RefreshTokenPayload} from "../dtos/jwt/RefreshTokenPayload";

export class JwtUtils {
    private static readonly DEFAULT_EXPIRES_IN_SECONDS = 3600;

    private static getAccessTokenSecret(): string {
        const secret = process.env.OAUTH_ACCESS_TOKEN_SECRET;

        if (!secret) {
            throw new Error('OAUTH_ACCESS_TOKEN_SECRET is not defined');
        }

        return secret;
    }

    private static getRefreshTokenSecret(): string {
        const secret = process.env.OAUTH_REFRESH_TOKEN_SECRET;

        if (!secret) {
            throw new Error('OAUTH_REFRESH_TOKEN_SECRET is not defined');
        }

        return secret;
    }

    static generateTokenId(): string {
        return crypto.randomUUID();
    }

    static generateAccessToken(
        payload: AccessTokenPayload,
        expiresInSeconds: number
    ): string {
        const options: SignOptions = {
            expiresIn: expiresInSeconds,
            algorithm: 'HS256',
        };

        return jwt.sign(payload, this.getAccessTokenSecret(), options);
    }

    static generateRefreshToken(
        payload: RefreshTokenPayload,
        expiresInSeconds: number
    ): string {
        const options: SignOptions = {
            expiresIn: expiresInSeconds,
            algorithm: 'HS256',
        };

        return jwt.sign(payload, this.getRefreshTokenSecret(), options);
    }

    static verifyAccessToken(token: string): AccessTokenPayload | null {
        try {
            return jwt.verify(token, this.getAccessTokenSecret()) as AccessTokenPayload;
        } catch {
            return null;
        }
    }

    static verifyRefreshToken(token: string): RefreshTokenPayload | null {
        try {
            return jwt.verify(token, this.getRefreshTokenSecret()) as RefreshTokenPayload;
        } catch {
            return null;
        }
    }

    static decodeWithoutVerify(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch {
            return null;
        }
    }
}