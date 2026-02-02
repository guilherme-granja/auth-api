import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterDTO } from '../dtos/auth/RegisterDTO';
import { RegisterInput } from '../validators/authSchemas';

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
            const validateData = req.body as RegisterInput;
            const registerDTO = RegisterDTO.fromRequest(validateData);

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