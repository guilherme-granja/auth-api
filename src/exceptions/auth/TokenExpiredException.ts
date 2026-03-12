import { UnauthorizedException } from '../UnauthorizedException';

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token has expired');
  }
}
