import { UserRepository } from '../repositories/UserRepository';
import { NotFoundException } from '../exceptions/NotFoundException';
import { UserResult } from '../dtos/user/UserResult';
import { EmailService } from './EmailService';
import { ForgotPasswordDTO } from '../dtos/user/ForgotPasswordDTO';
import { PasswordResetUtils } from '../utils/passwordReset';
import { ResetPasswordDTO } from '../dtos/user/ResetPasswordDTO';
import { InvalidResetTokenException } from '../exceptions/user/InvalidResetTokenException';
import { HashUtils } from '../utils/hash';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';

export class UserService {
  private userRepository: UserRepository;
  private emailService: EmailService;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor(
    userRepository?: UserRepository,
    emailService?: EmailService,
    refreshTokenRepository?: RefreshTokenRepository
  ) {
    this.userRepository = userRepository || new UserRepository();
    this.emailService = emailService || new EmailService();
    this.refreshTokenRepository = refreshTokenRepository || new RefreshTokenRepository();
  }

  async me(id?: string): Promise<UserResult> {
    if (!id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      return;
    }

    const resetToken = PasswordResetUtils.generateToken();
    const resetTokenExpiry = PasswordResetUtils.calculateExpiry();

    await this.userRepository.setResetToken(user.id, resetToken, resetTokenExpiry);
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByResetToken(dto.token);

    if (!user) {
      throw new InvalidResetTokenException();
    }

    if (PasswordResetUtils.isExpired(user.resetTokenExpiry)) {
      await this.userRepository.clearResetToken(user.id);
      throw new InvalidResetTokenException();
    }

    const hashedPassword = await HashUtils.hash(dto.password);

    // Invalidate all sessions (force re-login)
    await this.userRepository.update(user.id, { password: hashedPassword });
    await this.userRepository.clearResetToken(user.id);
    await this.refreshTokenRepository.revokeAllUserTokens(user.id);
  }
}
