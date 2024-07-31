import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';
import path from 'path';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';
import { ClerkError } from '@/constants/clerk.constants';
import webhooksRouter from '@/routes/webhooks.routes';

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

app.use('/api/v1/users', async (req, res) => {
    console.log('req.auth', req.auth.userId);
    const userList = await clerkClient.users.getUser(req.auth.userId!);
    res.json(userList);
});

app.use((err: Error, req: Request, res: Response) => {
    console.log('err', err.message);

    if (err.message === ClerkError.Unauthenticated) {
        return res.status(401).json({ message: 'Unauthenticated!' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
});

// Error handlers
app.use(errorHandler());

export { app, logger };
