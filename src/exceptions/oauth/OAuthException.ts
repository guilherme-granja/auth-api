import {HttpException} from "../HttpException";

export class OAuthException extends HttpException {
    public readonly errorCode: string;

    constructor(
        statusCode: number,
        errorCode: string,
        message: string
    ) {
        super(statusCode, message);
        this.errorCode = errorCode;
    }

    toResponse() {
        return {
            error: this.errorCode,
            error_description: this.message,
        };
    }
}