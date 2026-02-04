import {UnauthorizedException} from "../UnauthorizedException";

export class MissingTokenException extends UnauthorizedException {
    constructor() {
        super('Authentication token is required');
    }
}