import { Router } from 'express';
import { AuthController } from "../../../controllers/AuthController";
import { validateRequest } from "../../../middlewares/validateRequest";
import {loginSchema, registerSchema} from "../../../validators/authSchemas";

const router = Router();
const authController = new AuthController();

router.post(
    '/register',
    validateRequest(registerSchema),
    authController.register
);

router.post(
    '/login',
    validateRequest(loginSchema),
    authController.login
);

export default router;