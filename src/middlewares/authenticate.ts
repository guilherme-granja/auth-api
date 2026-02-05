import { Request, Response, NextFunction } from 'express';
import { MissingTokenException } from '../exceptions/auth/MissingTokenException';
import { InvalidTokenException } from '../exceptions/auth/InvalidTokenException';
import {OAuthServer} from "../services/oauth/grants/OAuthServer";

const oauthServer = new OAuthServer();

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractTokenFromHeader(req);

        if (!token) {
            throw new MissingTokenException();
        }

        const validatedToken = await oauthServer.validateAccessToken(token);

        if (!validatedToken) {
            throw new InvalidTokenException();
        }

        req.user = validatedToken.userId
            ? { id: validatedToken.userId }
            : undefined;

        req.oauth = {
            clientId: validatedToken.clientId,
            scopes: validatedToken.scopes,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const requireScopes = (requiredScopes: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const tokenScopes = req.oauth?.scopes || [];

        const hasAllScopes = requiredScopes.every(scope =>
            tokenScopes.includes(scope)
        );

        if (!hasAllScopes) {
            return res.status(403).json({
                error: 'insufficient_scope',
                error_description: `Required scopes: ${requiredScopes.join(', ')}`,
            });
        }

        next();
    };
};

function extractTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return null;
    }

    const [scheme, token] = parts;

    if (scheme.toLowerCase() !== 'bearer') {
        return null;
    }

    return token;
}