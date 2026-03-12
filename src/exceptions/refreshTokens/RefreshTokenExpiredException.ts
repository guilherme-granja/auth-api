import { UnauthorizedException } from '../UnauthorizedException';

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Refresh token has expired. Please login again');
  }
}
