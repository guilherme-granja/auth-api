import { OAuthException } from './OAuthException';

export class InvalidRequestException extends OAuthException {
    constructor(message: string = 'The request is invalid') {
        super(400, 'invalid_request', message);
    }
}