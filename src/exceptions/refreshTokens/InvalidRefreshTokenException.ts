import { UnauthorizedException } from '../UnauthorizedException';

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Invalid refresh token');
  }
}
