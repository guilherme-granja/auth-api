import { Router } from 'express';
import { AuthController } from '../../../controllers/AuthController';
import { validateRequest } from '../../../middlewares/validateRequest';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../../../validators/authSchemas';
import { authenticate } from '../../../middlewares/authenticate';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest(registerSchema), authController.register);

router.post('/login', validateRequest(loginSchema), authController.login);

router.post('/refresh', validateRequest(refreshTokenSchema), authController.refresh);

router.post('/logout', validateRequest(logoutSchema), authController.logout);

router.post('/logout-all', authenticate, authController.logoutAll);

export default router;
