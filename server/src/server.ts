import cors from 'cors'
import express from 'express'
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

const logger = pino({ name: 'server start' })
const app = express()

// Set the application to trust the reverse proxy
app.set('trust proxy', true)

// Serve client
app.use('/', express.static(path.join(__dirname, '..', 'public')))

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(helmet())
app.use(rateLimiter)

// Request logging
app.use(requestLogger)

// Routes
// app.use('/health-check', healthCheckRouter)

// Healthcheck handler
app.get('/healthz', (req, res) => {
    res.json({
        status: 'OK',
    })
})

app.use('/api/users', userRouter)

// Swagger UI
app.use(openAPIRouter)

// Error handlers
app.use(errorHandler())

export { app, logger }
