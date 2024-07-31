import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pino } from 'pino';
import path from 'path';
import { healthCheckRouter } from '@/routes/healthCheck.routes';
import { errorMiddleware, unexpectedRequest } from '@/middleware/errorHandler';
import rateLimiter from '@/middleware/rateLimiter';
import requestLogger from '@/middleware/requestLogger';
import { env } from '@/utils/envConfig';
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';
import webhooksRouter from '@/routes/webhooks.routes';
import { ApiResponse } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';

const logger = pino({ name: 'server start' });
const app = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Serve client
app.use(express.static(path.join(__dirname, '..', 'client-build')));

/**
 * Middlewares
 */
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/api/v1/webhooks', webhooksRouter);

app.use(express.json()); // check clerk body parser

// Use the strict middleware that raises an error when unauthenticated
app.use(ClerkExpressRequireAuth());

// TODO: middleware to check if user exists in irona db in 2sec interval
//validateRequest(UserSchema)
app.use('/api/v1/users', async (req, res) => {
    console.log('req.auth', req.auth.userId);
    const userList = await clerkClient.users.getUser(req.auth.userId!);
    const response = ApiResponse.success('', userList, StatusCodes.OK);
    res.status(response.statusCode).json(response);
});

// Handle errors
app.use(errorMiddleware);

// Error handler 404
app.use(unexpectedRequest);

export { app, logger };
