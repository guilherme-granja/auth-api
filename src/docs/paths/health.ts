import { OpenAPIV3 } from 'openapi-types';

export const healthPaths: OpenAPIV3.PathsObject = {
  '/api/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      description: 'Returns the API health status and current server timestamp.',
      operationId: 'healthCheck',
      responses: {
        '200': {
          description: 'API is healthy',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthCheck',
              },
            },
          },
        },
        '500': {
          $ref: '#/components/responses/InternalServerError',
        },
      },
    },
  },
};
