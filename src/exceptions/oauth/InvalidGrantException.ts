import {OAuthException} from "./OAuthException";

export class InvalidGrantException extends OAuthException {
    constructor(message: string = 'The provided authorization grant is invalid') {
        super(400, 'invalid_grant', message);
    }
}