import {UnauthorizedException} from "../UnauthorizedException";

export class InvalidCredentialsException extends UnauthorizedException {
    constructor() {
        super('Invalid email or password');
    }
}