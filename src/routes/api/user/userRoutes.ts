import { Router } from 'express';
import {UserController} from "../../../controllers/UserController";
import {authenticate} from "../../../middlewares/authenticate";
import {validateRequest} from "../../../middlewares/validateRequest";
import {forgotPasswordSchema, resetPasswordSchema} from "../../../validators/userSchemas";

const router = Router();
const userController = new UserController();

router.get(
    '/me',
    authenticate,
    userController.me
)

router.post(
    '/forgot-password',
    validateRequest(forgotPasswordSchema),
    userController.forgotPassword
)

router.post(
    '/reset-password',
    validateRequest(resetPasswordSchema),
    userController.resetPassword
)

export default router;