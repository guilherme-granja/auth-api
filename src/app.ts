import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import routes from './routes';
// import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
// app.use('/api', routes);

// app.use(errorHandler);

export default app;