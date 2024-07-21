import jwt from 'jsonwebtoken'
import { env } from '@/common/utils/envConfig'
import { Request, Response } from 'express'

export const generateAuthTokens = (email: string) => {
    const payload = { email }

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: '1m',
    })

    // Generate refresh token with expiration time
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: '1y',
    })

    return {
        accessToken,

        refreshToken,
    }
}

export const setAuthCookie = (
    req: Request,
    accessToken: string,
    refreshToken: string
) => {
    if (req.session) {
        req.session.accessToken = accessToken
        req.session.refreshToken = refreshToken
    } else {
        throw new Error('Session not found')
    }
}
