import { Router } from 'express'
import userRouter from '@/routes/v1/user.route'
import authRouter from '@/routes/v1/auth.route'

const v1Router = Router()

v1Router.use('/auth', authRouter)
v1Router.use('/users', userRouter)

export default v1Router
