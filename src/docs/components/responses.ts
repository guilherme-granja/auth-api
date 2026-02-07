import { OpenAPIV3 } from 'openapi-types';

export const responses: Record<string, OpenAPIV3.ResponseObject> = {
  UnauthorizedError: {
    description: 'Authentication failed or token is invalid/expired',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          success: false,
          message: 'Invalid email or password',
        },
      },
    },
  },

  ConflictError: {
    description: 'Resource already exists',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          success: false,
          message: 'User already exists',
        },
      },
    },
  },

  NotFoundError: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          success: false,
          message: 'User not found',
        },
      },
    },
  },

  ValidationError: {
    description: 'Request validation failed',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ValidationError',
        },
        example: {
          message: 'Validation failed',
          errors: [
            {
              field: 'body.email',
              message: 'Invalid email',
            },
            {
              field: 'body.password',
              message: 'Password must be at least 8 characters',
            },
          ],
        },
      },
    },
  },

  InternalServerError: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          success: false,
          message: 'Internal server error',
        },
      },
    },
  },

  BadRequestError: {
    description: 'Bad request - invalid or expired token',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          success: false,
          message: 'Invalid or expired reset token',
        },
      },
    },
  },
};
