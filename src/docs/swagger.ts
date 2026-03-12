import { OpenAPIV3 } from 'openapi-types';
import { components } from './components';
import { paths } from './paths';

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Auth API',
    version: '1.0.0',
    description: `
A RESTful authentication API built with Node.js, Express, and TypeScript.

## Features
- User registration and authentication
- JWT access tokens with refresh token rotation
- Token blacklisting via Redis
- Password reset via email
- Device tracking for sessions

## Authentication
Most endpoints require a valid JWT access token. Include it in the Authorization header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

## Rate Limiting
No rate limiting is currently implemented. This is a study project.

## Error Responses
All error responses follow a consistent format with \`success: false\` and a \`message\` field.
    `,
    contact: {
      name: 'API Support',
    },
    license: {
      name: 'Educational Use Only',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
    {
      name: 'Authentication',
      description: 'User authentication and token management',
    },
    {
      name: 'User',
      description: 'User profile and password management',
    },
  ],
  paths,
  components,
};

export { swaggerDefinition };
