import { OAuthException } from './OAuthException';

export class AccessDeniedException extends OAuthException {
    constructor(message: string = 'Access denied') {
        super(403, 'access_denied', message);
    }
}