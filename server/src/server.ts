import cors from 'cors'
import express, { Request } from 'express'
import helmet from 'helmet'
import { pino } from 'pino'
import path from 'path'
import { openAPIRouter } from '@/api-docs/openAPIRouter'
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter'
import { userRouter } from '@/api/user/userRouter'
import errorHandler from '@/common/middleware/errorHandler'
import rateLimiter from '@/common/middleware/rateLimiter'
import requestLogger from '@/common/middleware/requestLogger'
import { env } from '@/common/utils/envConfig'
import v1Router from '@/routes/v1'
import passport from 'passport'
import cookieSession from 'cookie-session'
const logger = pino({ name: 'server start' })
const app = express()

// Set the application to trust the reverse proxy
app.set('trust proxy', true)

// Serve client
app.use('/', express.static(path.join(__dirname, '..', 'public')))

// Rate Limiter
app.use(rateLimiter)

// Security
app.use(helmet())

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))

// JSON
app.use(express.json())

// Cookie Parser // Add session to Request
app.use(
    cookieSession({
        name: 'session',
        secret: env.COOKIE_KEY,
        httpOnly: true,
        secure: env.isProduction,
        sameSite: 'lax',
        signed: true,
    })
)

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Request logging
app.use(requestLogger)

// Routes

// Healthcheck handler
app.use('/health-check', healthCheckRouter)

// app.use('/api/users', userRouter) // TODO: remove

app.use('/api/v1', v1Router)

// Swagger UI
app.use(openAPIRouter)

// Error handlers
app.use(errorHandler())

export { app, logger }
