import {JwtPayload} from "jsonwebtoken";

export interface RefreshTokenPayload extends JwtPayload {
    jti: string;
    access_token_id: string;
    client_id: string;
}