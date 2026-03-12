import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validateRequest = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validated.body ?? req.body;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: 'Validation failed',
          errors: error.issues.map((iss) => ({
            field: iss.path.join('.'),
            message: iss.message,
          })),
        });
      }

      next(error);
    }
  };
};
