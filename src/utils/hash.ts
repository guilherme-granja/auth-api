import bcrypt from 'bcrypt';

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
