import {OAuthException} from "./OAuthException";

export class InvalidClientException extends OAuthException {
    constructor(message: string = 'Client authentication failed') {
        super(401, 'invalid_client', message);
    }
}