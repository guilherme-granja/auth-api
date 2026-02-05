export interface AuthenticatedUser {
    id: string;
}

export interface OAuthInfo {
    clientId: string;
    scopes: string[];
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
            oauth?: OAuthInfo;
        }
    }
}