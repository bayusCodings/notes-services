import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import winston from 'winston';
import expressWinston from 'express-winston';
import routes from './routes';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import yaml from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import express, { Express } from 'express';
import { ErrorHandler, NotFoundErrorHandler } from './errorhandlers';

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: false,
    expressFormat: true,
    colorize: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  })
);

// Apply rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // Time window in milliseconds (e.g., 1 minute)
  max: 100, // Maximum number of requests allowed within the time window
});

app.use(rateLimiter);

// Apply request throttling middleware
const speedLimiter = slowDown({
  windowMs: 30 * 1000, // Time window in milliseconds (e.g., 30 seconds)
  delayAfter: 1, // Number of requests allowed before starting to delay responses
  delayMs: 500, // Delay time in milliseconds for each subsequent request
});

app.use(speedLimiter);

app.use(cors());
app.use('/api', routes);

const swaggerDocument = yaml.load(path.resolve(__dirname, './docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(NotFoundErrorHandler);
app.use(ErrorHandler);

export default app;
