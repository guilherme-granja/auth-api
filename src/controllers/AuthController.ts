import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { RegisterDTO } from '../dtos/auth/RegisterDTO';
import {LoginDTO} from "../dtos/auth/LoginDTO";
import {RefreshTokenDTO} from "../dtos/refreshToken/RefreshTokenDTO";
import {LogoutDTO} from "../dtos/auth/LogoutDTO";

export class AuthController {
    private authService: AuthService;

    constructor(authService?: AuthService) {
        this.authService = authService || new AuthService();
    }

    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
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
    };

    login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const loginDTO = LoginDTO.fromRequest(req.body);

            const metadata = {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
            };

            const result = await this.authService.login(loginDTO, metadata);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error)
        }
    };

    refresh = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const refreshDTO = RefreshTokenDTO.fromRequest(req.body);

            const metadata = {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
            };

            const result = await this.authService.refresh(refreshDTO, metadata);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const logoutDTO = LogoutDTO.fromRequest(req.body);

            await this.authService.logout(logoutDTO);

            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    logoutAll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user!.id;

            await this.authService.logoutAll(userId);

            res.status(200).json({
                success: true,
                message: 'Logged out from all devices',
            });
        } catch (error) {
            next(error);
        }
    };
}