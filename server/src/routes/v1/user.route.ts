import { Router } from 'express'
import { UserController } from '@/controllers/user.controller'
const userRouter = Router()

// /api/v1/users

userRouter.get('/', UserController.getUsers)

export default userRouter
