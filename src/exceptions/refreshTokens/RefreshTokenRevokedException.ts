import { UnauthorizedException } from '../UnauthorizedException';

export class RefreshTokenRevokedException extends UnauthorizedException {
  constructor() {
    super('Refresh token has revoked. Please login again');
  }
}
