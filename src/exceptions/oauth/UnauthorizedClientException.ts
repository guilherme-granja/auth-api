import { OAuthException } from './OAuthException';

export class UnauthorizedClientException extends OAuthException {
    constructor(message: string = 'The client is not authorized to use this grant type') {
        super(401, 'unauthorized_client', message);
    }
}