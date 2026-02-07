import { OpenAPIV3 } from 'openapi-types';

export const authPaths: OpenAPIV3.PathsObject = {
  '/api/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description: 'Creates a new user account with email and password.',
      operationId: 'register',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'User created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
              example: {
                success: true,
                message: 'User created',
              },
            },
          },
        },
        '409': {
          $ref: '#/components/responses/ConflictError',
        },
        '422': {
          $ref: '#/components/responses/ValidationError',
        },
        '500': {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/api/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Authenticate user',
      description:
        'Authenticates a user with email and password. Returns JWT access token and refresh token.',
      operationId: 'login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Authentication successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/TokenResponse',
                  },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError',
        },
        '422': {
          $ref: '#/components/responses/ValidationError',
        },
        '500': {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/api/auth/refresh': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description:
        'Exchanges a valid refresh token for a new access token and refresh token pair. The old refresh token is revoked (token rotation). Include the current access token in the Authorization header for blacklisting.',
      operationId: 'refreshToken',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RefreshTokenRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Token refreshed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/TokenResponse',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Invalid, expired, or revoked refresh token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
              examples: {
                invalid: {
                  summary: 'Invalid credentials',
                  value: {
                    success: false,
                    message: 'Invalid email or password',
                  },
                },
                expired: {
                  summary: 'Token expired',
                  value: {
                    success: false,
                    message: 'Refresh token has expired',
                  },
                },
                revoked: {
                  summary: 'Token revoked',
                  value: {
                    success: false,
                    message: 'Refresh token has been revoked',
                  },
                },
              },
            },
          },
        },
        '422': {
          $ref: '#/components/responses/ValidationError',
        },
        '500': {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/api/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout user',
      description:
        'Revokes the refresh token and blacklists the access token. Include the current access token in the Authorization header for blacklisting.',
      operationId: 'logout',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LogoutRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Logged out successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
              example: {
                success: true,
                message: 'Logged out successfully',
              },
            },
          },
        },
        '422': {
          $ref: '#/components/responses/ValidationError',
        },
        '500': {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/api/auth/logout-all': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout from all devices',
      description:
        'Revokes all refresh tokens for the authenticated user and blacklists the current access token. Requires authentication.',
      operationId: 'logoutAll',
      security: [{ BearerAuth: [] }],
      responses: {
        '200': {
          description: 'Logged out from all devices',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
              example: {
                success: true,
                message: 'Logged out from all devices',
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError',
        },
        '500': {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
};
