import bcrypt from 'bcrypt';

/**
 * REVIEW: [TIP] I think you're bringing your PHP knowledge here, but in TS/JS you
 * need to break this habit, you don't need classes for everything and you can simply export
 * named functions, for example
 *
 * export function hash(password: string): Promise<string> {
 *   return bcrypt.hash(password, 10);
 * }
 *
 * import { hash } from './hash';
 */

export class HashUtils {
  private static readonly ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.ROUNDS);
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async needsRehash(hashedPassword: string) {
    const round: number = bcrypt.getRounds(hashedPassword);
    return round !== this.ROUNDS;
  }
}
