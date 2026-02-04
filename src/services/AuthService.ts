import { UserRepository } from "../repositories/UserRepository";
import { HashUtils } from "../utils/hash";
import { JwtUtils } from "../utils/jwt";
import { RegisterDTO } from "../dtos/auth/RegisterDTO";
import { UserAlreadyExistsException } from "../exceptions/auth/UserAlreadyExistsException";
import { LoginDTO } from "../dtos/auth/LoginDTO";
import { LoginResult } from "../dtos/auth/LoginResult";
import { InvalidCredentialsException } from "../exceptions/auth/InvalidCredentialsException";

export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserRepository();
    }

    async register(dto: RegisterDTO): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(
            dto.getNormalizedEmail()
        );

        if (existingUser) {
            throw new UserAlreadyExistsException();
        }

        const hashedPassword = await HashUtils.hash(dto.password);

        await this.userRepository.create({
            email: dto.getNormalizedEmail(),
            password: hashedPassword
        });
    }

    async login(dto: LoginDTO): Promise<LoginResult> {
        const user = await this.userRepository.findByEmail(dto.email);

        if (!user) {
            throw new InvalidCredentialsException();
        }

        const isPasswordValid = await HashUtils.compare(
            dto.password,
            user.password
        );

        if (!isPasswordValid) {
            throw new InvalidCredentialsException();
        }

        await this.rehashPasswordIfNeeded(user.id, dto.password, user.password);

        const { token, expiresAt } = JwtUtils.generateAccessToken({ sub: user.id });

        return {
            tokenType: 'Bearer',
            accessToken: token,
            expiresAt: expiresAt.toISOString(),
        };
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
}