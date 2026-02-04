import { Router } from 'express';
import { AuthController } from "../../../controllers/AuthController";
import { validateRequest } from "../../../middlewares/validateRequest";
import { registerSchema } from "../../../validators/authSchemas";

const router = Router();
const authController = new AuthController();

router.post(
    '/register',
    validateRequest(registerSchema),
    authController.register
);

export default router;