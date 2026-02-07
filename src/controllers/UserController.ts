import { UserService } from '../services/UserService';
import { NextFunction, Request, Response } from 'express';
import { ForgotPasswordDTO } from '../dtos/user/ForgotPasswordDTO';
import { ResetPasswordDTO } from '../dtos/user/ResetPasswordDTO';

export class UserController {
  private userService: UserService;

  constructor(userService?: UserService) {
    this.userService = userService || new UserService();
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.me(req.user?.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ForgotPasswordDTO.fromRequest(req.body);

      await this.userService.forgotPassword(dto);

      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = ResetPasswordDTO.fromRequest(req.body);

      await this.userService.resetPassword(dto);

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. Please login with your new password.',
      });
    } catch (error) {
      next(error);
    }
  };
}
