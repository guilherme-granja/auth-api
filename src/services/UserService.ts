import {UserRepository} from "../repositories/UserRepository";
import {NotFoundException} from "../exceptions/NotFoundException";
import {UserResult} from "../dtos/user/UserResult";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserRepository();
    }

    async me(id?: string): Promise<UserResult> {
        if (!id) {
            throw new NotFoundException('User not found')
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt.toISOString()
        };
    }
}