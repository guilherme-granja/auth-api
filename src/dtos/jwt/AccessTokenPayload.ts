import {JwtPayload} from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
    jti: string;
    sub?: string;
    client_id: string;
    scope: string;
}