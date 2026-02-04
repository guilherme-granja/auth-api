import { Router } from 'express';
import {UserController} from "../../../controllers/UserController";
import {authenticate} from "../../../middlewares/authenticate";

const router = Router();
const userController = new UserController();

router.get(
    '/me',
    authenticate,
    userController.me
)

export default router;