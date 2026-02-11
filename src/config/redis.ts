// src/config/redis.ts
import { createClient } from 'redis';

/**
 * REVIEW: avoid using any, try to use the type provided by the library
 * for example
 *
 * private static instance: RedisClient = null;
 * private static connecting: Promise<RedisClient> | null = null;
 */
class RedisClientManager {
  private static instance: any = null;
  private static connecting: Promise<any> | null = null;

  static async getInstance() {
    if (this.instance?.isOpen) {
      return this.instance;
    }

    if (this.connecting) {
      return this.connecting;
    }

    // Create new connection
    this.connecting = this.connect();
    this.instance = await this.connecting;
    this.connecting = null;

    return this.instance;
  }

  private static async connect() {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    // Error handling
    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('🔌 Redis connecting...');
    });

    client.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    client.on('end', () => {
      console.log('🛑 Redis connection closed');
    });

    await client.connect();

    return client;
  }

  static async disconnect(): Promise<void> {
    if (this.instance?.isOpen) {
      await this.instance.quit();
      this.instance = null;
    }
  }
}

export default RedisClientManager;
