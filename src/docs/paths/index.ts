import { OpenAPIV3 } from 'openapi-types';
import { authPaths } from './auth.js';
import { userPaths } from './user.js';
import { healthPaths } from './health.js';

export const paths: OpenAPIV3.PathsObject = {
  ...healthPaths,
  ...authPaths,
  ...userPaths,
};
