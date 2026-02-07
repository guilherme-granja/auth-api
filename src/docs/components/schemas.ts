import { OpenAPIV3 } from 'openapi-types';

export const schemas: Record<string, OpenAPIV3.SchemaObject> = {
  // Request Schemas
  RegisterRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address (will be lowercased and trimmed)',
        example: 'user@example.com',
      },
      password: {
        type: 'string',
        format: 'password',
        minLength: 8,
        description:
          'Password (min 8 chars, must contain uppercase, lowercase, number, and special character)',
        example: 'MySecurePass1!',
      },
    },
  },

  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
        example: 'user@example.com',
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'User password',
        example: 'MySecurePass1!',
      },
    },
  },

  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        description: 'The refresh token received from login or previous refresh',
        example: 'a1b2c3d4e5f6g7h8i9j0...',
      },
    },
  },

  LogoutRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        description: 'The refresh token to revoke',
        example: 'a1b2c3d4e5f6g7h8i9j0...',
      },
    },
  },

  ForgotPasswordRequest: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email address associated with the account',
        example: 'user@example.com',
      },
    },
  },

  ResetPasswordRequest: {
    type: 'object',
    required: ['token', 'password'],
    properties: {
      token: {
        type: 'string',
        description: 'Password reset token received via email',
        example: 'reset-token-from-email',
      },
      password: {
        type: 'string',
        format: 'password',
        minLength: 8,
        description:
          'New password (min 8 chars, must contain uppercase, lowercase, number, and special character)',
        example: 'NewSecurePass1!',
      },
    },
  },

  // Response Schemas
  TokenResponse: {
    type: 'object',
    properties: {
      tokenType: {
        type: 'string',
        example: 'Bearer',
      },
      accessToken: {
        type: 'string',
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
        description: 'Access token expiration timestamp',
        example: '2026-02-04T13:00:00.000Z',
      },
      refreshToken: {
        type: 'string',
        description: 'Refresh token for obtaining new access tokens',
        example: 'a1b2c3d4e5f6g7h8i9j0...',
      },
    },
  },

  UserProfile: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'User unique identifier (UUID v7)',
        example: '0192d4f8-1234-7abc-8def-123456789abc',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
        example: 'user@example.com',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Account creation timestamp',
        example: '2026-01-01T00:00:00.000Z',
      },
    },
  },

  HealthCheck: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        example: 'OK',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2026-02-04T12:00:00.000Z',
      },
    },
  },

  // Generic Response Wrappers
  SuccessResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
      },
    },
  },

  SuccessDataResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      data: {
        type: 'object',
      },
    },
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
      },
    },
  },

  ValidationError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Validation failed',
      },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              example: 'body.email',
            },
            message: {
              type: 'string',
              example: 'Invalid email',
            },
          },
        },
      },
    },
  },
};
