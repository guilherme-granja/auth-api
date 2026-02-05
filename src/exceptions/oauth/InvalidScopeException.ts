import { OAuthException } from './OAuthException';

export class InvalidScopeException extends OAuthException {
    constructor(message: string = 'The requested scope is invalid') {
        super(400, 'invalid_scope', message);
    }
}