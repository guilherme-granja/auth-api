import { UnauthorizedException } from '../UnauthorizedException';

export class InvalidResetTokenException extends UnauthorizedException {
  constructor() {
    super('Invalid or expired reset token');
  }
}
