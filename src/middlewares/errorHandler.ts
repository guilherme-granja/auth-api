import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof HttpException) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors && { errors: error.errors }),
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
