import { Router } from 'express'
import { AuthController } from '@/controllers/auth.controller'
const authRouter = Router()

// /api/v1/auth

// Public Routes
authRouter.post('/register', AuthController.registration)
authRouter.post('/login', AuthController.login)

export default authRouter
