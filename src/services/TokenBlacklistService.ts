import RedisClient from '../config/redis';
import jwt from 'jsonwebtoken';

export class TokenBlacklistService {
    private static readonly BLACKLIST_PREFIX = 'blacklist:token:';

    static async add(token: string | null): Promise<void> {
        try {
            if (!token) {
                throw new Error('No token provided.');
            }

            const redis = await RedisClient.getInstance();

            const decoded = jwt.decode(token) as { exp: number } | null;

            if (!decoded || !decoded.exp) {
                throw new Error('Invalid token: no expiration');
            }

            const now = Math.floor(Date.now() / 1000);
            const ttl = decoded.exp - now;

            if (ttl > 0) {
                const key = this.BLACKLIST_PREFIX + token;
                await redis.setEx(key, ttl, '1');

                console.log(`🚫 Token blacklisted for ${ttl} seconds`);
            }
        } catch (error) {
            console.error('❌ Failed to blacklist token:', error);
            throw error;
        }
    }

    static async isBlacklisted(token: string): Promise<boolean> {
        try {
            const redis = await RedisClient.getInstance();
            const key = this.BLACKLIST_PREFIX + token;
            const result = await redis.get(key);

            return result !== null;
        } catch (error) {
            console.error('❌ Failed to check blacklist:', error);
            return false;
        }
    }

    static async remove(token: string): Promise<void> {
        try {
            const redis = await RedisClient.getInstance();
            const key = this.BLACKLIST_PREFIX + token;

            await redis.del(key);
        } catch (error) {
            console.error('❌ Failed to remove from blacklist:', error);
            throw error;
        }
    }

    static async getStats(): Promise<{ count: number }> {
        try {
            const redis = await RedisClient.getInstance();
            const keys = await redis.keys(this.BLACKLIST_PREFIX + '*');

            return { count: keys.length };
        } catch (error) {
            console.error('❌ Failed to get blacklist stats:', error);
            return { count: 0 };
        }
    }
}