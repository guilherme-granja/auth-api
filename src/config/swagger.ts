import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import { swaggerDefinition } from '../docs';

const router = Router();

const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'Auth API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDefinition, swaggerUiOptions));

export { router as swaggerRouter };
