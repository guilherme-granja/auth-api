import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterDTO } from '../dtos/auth/RegisterDTO';
import { registerSchema } from '../validators/authSchemas';

export class AuthController {
    private authService: AuthService;

    constructor(authService?: AuthService) {
        this.authService = authService || new AuthService();
    }

    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const validateData = registerSchema.parse(req);
            const registerDTO = RegisterDTO.fromRequest(validateData.body);

            await this.authService.register(registerDTO);

            res.status(201).json({
                success: true,
                message: 'User created'
            });
        } catch (error) {
            next(error)
        }
    }
}