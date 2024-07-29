import dotenv from 'dotenv'
import { cleanEnv, num, port, str, testOnly } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
    NODE_ENV: str({
        devDefault: testOnly('test'),
        choices: ['development', 'production', 'test'],
    }),
    PORT: port({ devDefault: testOnly(3000) }),
    CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
    COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
    COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
    CLERK_PUBLISHABLE_KEY: str({ devDefault: testOnly('pk_test_123') }),
    CLERK_SECRET_KEY: str({ devDefault: testOnly('sk_test_123') }),
    CLERK_WEBHOOK_SECRET: str({ devDefault: testOnly('whsec_test_123') }),
})
