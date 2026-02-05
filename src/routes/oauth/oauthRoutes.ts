import { Router } from 'express';
import {OAuthController} from "../../../controllers/OAuthController";
import {authenticate} from "../../../middlewares/authenticate";

const router = Router();
const oauthController = new OAuthController();

router.post(
    '/token',
    oauthController.token
);

router.get(
    '/authorize',
    authenticate,
    oauthController.authorize
);

export default router;