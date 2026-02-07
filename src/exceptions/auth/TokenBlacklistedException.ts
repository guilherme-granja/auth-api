import { UnauthorizedException } from '../UnauthorizedException';

export class TokenBlacklistedException extends UnauthorizedException {
    constructor() {
        super('Token has been revoked');
    }
}