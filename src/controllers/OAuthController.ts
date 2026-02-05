import { Request, Response, NextFunction } from 'express';
import { OAuthException } from '../exceptions/oauth/OAuthException';
import {OAuthServer} from "../services/oauth/grants/OAuthServer";

export class OAuthController {
    private oauthServer: OAuthServer;

    constructor() {
        this.oauthServer = new OAuthServer();
    }

    token = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const tokenResponse = await this.oauthServer.handleTokenRequest(req.body);

            res.status(200).json(tokenResponse);
        } catch (error) {
            if (error instanceof OAuthException) {
                res.status(error.statusCode).json(error.toResponse());
                return;
            }
            next(error);
        }
    };

    authorize = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'login_required',
                    error_description: 'User must be authenticated',
                });
                return;
            }

            const authResponse = await this.oauthServer.handleAuthorizationRequest(
                req.query as any,
                req.user.id
            );

            const redirectUrl = new URL(authResponse.redirect_uri);

            redirectUrl.searchParams.set('code', authResponse.code);

            if (authResponse.state) {
                redirectUrl.searchParams.set('state', authResponse.state);
            }

            res.redirect(redirectUrl.toString());
        } catch (error) {
            if (error instanceof OAuthException) {
                const redirectUri = req.query.redirect_uri as string;

                if (redirectUri) {
                    const redirectUrl = new URL(redirectUri);

                    redirectUrl.searchParams.set('error', error.errorCode);
                    redirectUrl.searchParams.set('error_description', error.message);

                    if (req.query.state) {
                        redirectUrl.searchParams.set('state', req.query.state as string);
                    }

                    res.redirect(redirectUrl.toString());
                    return;
                }

                res.status(error.statusCode).json(error.toResponse());
                return;
            }

            next(error);
        }
    };
}