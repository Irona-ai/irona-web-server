import { Request, Response } from 'express'
import { LoginSchema, RegisterSchema } from '@/validators/auth.validator'
import { StatusCodes } from 'http-status-codes'
import { AuthModel } from '@/models/auth.model'
import bcrypt from 'bcrypt'
import { ZodError } from 'zod'
import pino from 'pino'
import { generateAuthTokens, setAuthCookie } from '@/common/utils/auth.utils'
const logger = pino({ name: 'auth.controller' })

export class AuthController {
    static async registration(req: Request, res: Response) {
        try {
            const body = RegisterSchema.parse(req.body)

            // Check if email already exists
            const existingUser = await AuthModel.findUserByEmail(body.email)
            if (existingUser) {
                throw new Error('Email already exists')
            }

            // Get hashed password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(body.password, salt)

            // Create user
            const user = await AuthModel.createUser({
                ...body,
                password: hashedPassword,
                confirmPassword: hashedPassword,
            })

            // TODOsend email verification

            // Create JWT token
            const { accessToken, refreshToken } = generateAuthTokens(body.email)
            // Set cookie
            setAuthCookie(req, accessToken, refreshToken)

            const loggedinUser = { ...user } as Partial<typeof user>
            delete loggedinUser.createdAt
            delete loggedinUser.updatedAt
            delete loggedinUser.id
            delete loggedinUser.status

            return res.status(StatusCodes.CREATED).json(loggedinUser)
        } catch (error: any) {
            logger.error(error)
            if (error instanceof ZodError) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.issues,
                })
            }
            if (error.message === 'Email already exists') {
                return res.status(StatusCodes.CONFLICT).json({
                    error: 'Email already exists',
                })
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            })
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const body = LoginSchema.parse(req.body)

            // Check if email exists
            const auth = await AuthModel.findUserByEmail(body.email)
            if (!auth) {
                throw new Error('User not found')
            }

            // Check if password matches
            const isPasswordCorrect = await bcrypt.compare(
                body.password,
                auth.password
            )
            if (!isPasswordCorrect) {
                throw new Error('Invalid password')
            }

            // Create JWT token
            const { accessToken, refreshToken } = generateAuthTokens(auth.email)

            // Set cookie
            setAuthCookie(req, accessToken, refreshToken)

            // Add refresh token to session table
            await AuthModel.createSession(auth.User.id, refreshToken)

            const loggedinUser = { ...auth.User } as Partial<typeof auth.User>
            delete loggedinUser.createdAt
            delete loggedinUser.updatedAt
            delete loggedinUser.id
            delete loggedinUser.status

            return res.status(StatusCodes.OK).json(loggedinUser)
        } catch (error: any) {
            logger.error(error)
            if (error instanceof ZodError) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: error.issues,
                })
            }
            if (error.message === 'Invalid password') {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: 'Invalid password',
                })
            }
            if (error.message === 'User not found') {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: 'User not found',
                })
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            })
        }
    }
}
