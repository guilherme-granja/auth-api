import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterDTO } from '../dtos/auth/RegisterDTO';
import {LoginDTO} from "../dtos/auth/LoginDTO";

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
            const registerDTO = RegisterDTO.fromRequest(req.body);

            await this.authService.register(registerDTO);

            res.status(201).json({
                success: true,
                message: 'User created'
            });
        } catch (error) {
            next(error)
        }
    }

    login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const loginDTO = LoginDTO.fromRequest(req.body);

            const result = await this.authService.login(loginDTO);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error)
        }
    }
}