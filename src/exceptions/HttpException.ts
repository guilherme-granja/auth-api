export class HttpException extends Error {
  public statusCode: number;
  public message: string;
  public errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
