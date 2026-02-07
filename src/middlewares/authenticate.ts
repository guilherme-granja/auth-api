import { Request, Response, NextFunction } from 'express';
import { MissingTokenException } from '../exceptions/auth/MissingTokenException';
import { JwtUtils } from '../utils/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { TokenExpiredException } from '../exceptions/auth/TokenExpiredException';
import { InvalidCredentialsException } from '../exceptions/auth/InvalidCredentialsException';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new MissingTokenException();
    }

    const payload = JwtUtils.verifyToken(token);

    req.user = {
      id: payload.sub as string,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new TokenExpiredException());
    }

    if (error instanceof JsonWebTokenError) {
      return next(new InvalidCredentialsException());
    }

    next(error);
  }
};

function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  if (scheme.toLowerCase() !== 'bearer') {
    return null;
  }

  return token;
}
