import {UserService} from "../services/UserService";
import {NextFunction, Request, Response} from "express";

export class UserController {
    private userService: UserService;

    constructor(userService?: UserService) {
        this.userService = userService || new UserService()
    }

    me = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await this.userService.me(req.user?.id);

            res.status(200). json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}