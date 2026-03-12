import { OpenAPIV3 } from 'openapi-types';

export const userPaths: OpenAPIV3.PathsObject = {
  '/api/user/me': {
    get: {
      tags: ['User'],
      summary: 'Get current user profile',
      description: 'Returns the authenticated user profile information. Requires authentication.',
      operationId: 'getCurrentUser',
      security: [{ BearerAuth: [] }],
      responses: {
        '200': {
          description: 'User profile retrieved successfully',
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
                    $ref: '#/components/schemas/UserProfile',
                  },
                },
              },
            },
          },
        },
        '401': {
          $ref: '#/components/responses/UnauthorizedError',
        },
        '404': {
          $ref: '#/components/responses/NotFoundError',
        },
        '500': {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },

  '/api/user/forgot-password': {
    post: {
      tags: ['User'],
      summary: 'Request password reset',
      description:
        'Sends a password reset email to the user. Always returns success to prevent email enumeration attacks.',
      operationId: 'forgotPassword',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ForgotPasswordRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Password reset email sent (if account exists)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
              example: {
                success: true,
                message:
                  'If an account exists with this email, you will receive a password reset link.',
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

  '/api/user/reset-password': {
    post: {
      tags: ['User'],
      summary: 'Reset password',
      description:
        'Resets the user password using a valid reset token. Invalidates all existing sessions by revoking all refresh tokens.',
      operationId: 'resetPassword',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResetPasswordRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Password reset successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse',
              },
              example: {
                success: true,
                message:
                  'Password has been reset successfully. Please login with your new password.',
              },
            },
          },
        },
        '400': {
          $ref: '#/components/responses/BadRequestError',
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
};
