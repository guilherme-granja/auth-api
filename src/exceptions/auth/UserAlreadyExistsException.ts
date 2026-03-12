import { ConflictException } from '../ConflictException';

export class UserAlreadyExistsException extends ConflictException {
  constructor() {
    super(`User already exists`);
  }
}
