import { Router } from 'express'
import bodyParser from 'body-parser'
import WebhookController from '@/controller/webhook.controller'

const webhooksRouter = Router()

webhooksRouter.post(
    '/',
    bodyParser.raw({ type: 'application/json' }),
    WebhookController.verifyWebhook
)

export default webhooksRouter
