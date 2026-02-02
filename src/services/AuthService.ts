import { UserRepository } from "../repositories/UserRepository";
import { HashUtils } from "../utils/hash";
import { RegisterDTO } from "../dtos/auth/RegisterDTO";

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
            throw new Error('User with this email already exists')
        }

        const hashedPassword = await HashUtils.hash(dto.password);

        await this.userRepository.create({
            email: dto.getNormalizedEmail(),
            password: hashedPassword
        });
    }
}