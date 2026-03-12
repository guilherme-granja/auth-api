import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/api/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerRouter } from './config/swagger.js';

const app: Express = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/docs', swaggerRouter);

// API Routes
app.use('/api', routes);

app.use(errorHandler);

export default app;
