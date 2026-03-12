import { UnauthorizedException } from '../UnauthorizedException';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super('Invalid token');
  }
}
