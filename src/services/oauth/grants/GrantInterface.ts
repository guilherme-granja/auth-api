import { OAuthClient } from '../../../../generated/prisma/client';

export interface TokenResponse {
    token_type: 'Bearer';
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

export interface GrantRequest {
    client: OAuthClient;
    scopes: string[];
    ipAddress?: string;
    userAgent?: string;
}

export interface GrantInterface {
    readonly identifier: string;

    handle(request: GrantRequest, params: Record<string, any>): Promise<TokenResponse>;
}