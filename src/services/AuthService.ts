import { UserRepository } from '../repositories/UserRepository';
import { HashUtils } from '../utils/hash';
import { JwtUtils } from '../utils/jwt';
import { RegisterDTO } from '../dtos/auth/RegisterDTO';
import { UserAlreadyExistsException } from '../exceptions/auth/UserAlreadyExistsException';
import { LoginDTO } from '../dtos/auth/LoginDTO';
import { LoginResult } from '../dtos/auth/LoginResult';
import { InvalidCredentialsException } from '../exceptions/auth/InvalidCredentialsException';
import { TokenMetadata } from '../dtos/jwt/TokenMetadata';
import { RefreshTokenUtils } from '../utils/refreshToken';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { RefreshTokenDTO } from '../dtos/refreshToken/RefreshTokenDTO';
import { RefreshTokenExpiredException } from '../exceptions/refreshTokens/RefreshTokenExpiredException';
import { LogoutDTO } from '../dtos/auth/LogoutDTO';
import { RefreshTokenRevokedException } from '../exceptions/refreshTokens/RefreshTokenRevokedException';
import {TokenBlacklistService} from "./TokenBlacklistService";

export class AuthService {
  private userRepository: UserRepository;
  private refreshTokenRepository: RefreshTokenRepository;

  constructor(userRepository?: UserRepository, refreshTokenRepository?: RefreshTokenRepository) {
    this.userRepository = userRepository || new UserRepository();
    this.refreshTokenRepository = refreshTokenRepository || new RefreshTokenRepository();
  }

  async register(dto: RegisterDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(dto.getNormalizedEmail());

    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await HashUtils.hash(dto.password);

    await this.userRepository.create({
      email: dto.getNormalizedEmail(),
      password: hashedPassword,
    });
  }

  async login(dto: LoginDTO, metadata?: TokenMetadata): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await HashUtils.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    await this.rehashPasswordIfNeeded(user.id, dto.password, user.password);

    return await this.generateTokenPair(user.id, metadata);
  }

  async refresh(dto: RefreshTokenDTO, metadata?: TokenMetadata): Promise<LoginResult> {
    const storedToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);

    if (!storedToken) {
      throw new InvalidCredentialsException();
    }

    if (RefreshTokenUtils.isRevoked(storedToken.revoked)) {
      await TokenBlacklistService.add(dto.accessToken);
      await this.refreshTokenRepository.revokeAllUserTokens(storedToken.userId);
      throw new RefreshTokenRevokedException();
    }

    if (RefreshTokenUtils.isExpired(storedToken.expiresAt)) {
      await TokenBlacklistService.add(dto.accessToken);
      await this.refreshTokenRepository.revokeById(storedToken.id);
      throw new RefreshTokenExpiredException();
    }

    await this.refreshTokenRepository.revokeById(storedToken.id);

    return this.generateTokenPair(storedToken.userId, metadata);
  }

  async logout(dto: LogoutDTO): Promise<void> {
    const storedToken = await this.refreshTokenRepository.findByToken(dto.refreshToken);

    if (storedToken) {
      await TokenBlacklistService.add(dto.accessToken)
      await this.refreshTokenRepository.revokeById(storedToken.id);
    }
  }

  async logoutAll(userId: string, accessToken: string | null): Promise<void> {
    await TokenBlacklistService.add(accessToken);
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }

  private async rehashPasswordIfNeeded(
    userId: string,
    plainPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const needRehash = await HashUtils.needsRehash(hashedPassword);

    if (needRehash) {
      const newHash = await HashUtils.hash(plainPassword);
      await this.userRepository.update(userId, { password: newHash });
    }
  }

  private async generateTokenPair(userId: string, metadata?: TokenMetadata): Promise<LoginResult> {
    const { token: accessToken, expiresAt } = JwtUtils.generateAccessToken({ sub: userId });

    const refreshToken = RefreshTokenUtils.generateToken();
    const refreshTokenExpiresAt = RefreshTokenUtils.calculateExpiresAt();

    await this.refreshTokenRepository.create({
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt,
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress,
      user: {
        connect: { id: userId },
      },
    });

    return {
      tokenType: 'Bearer',
      accessToken,
      expiresAt: expiresAt.toISOString(),
      refreshToken,
    };
  }
}
