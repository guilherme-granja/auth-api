import { OpenAPIV3 } from 'openapi-types';

export const securitySchemes: Record<string, OpenAPIV3.SecuritySchemeObject> = {
  BearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'JWT access token obtained from login or refresh endpoints',
  },
};
