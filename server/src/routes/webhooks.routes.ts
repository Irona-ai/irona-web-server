import { Router } from 'express';
import bodyParser from 'body-parser';
import WebhookController from '@/controller/webhook.controller';
import { clerkWebhookMiddleware } from '@/middleware/clerkWebhook';

const webhooksRouter = Router();

webhooksRouter.post(
    '/',
    bodyParser.raw({ type: 'application/json' }),
    clerkWebhookMiddleware,
    WebhookController.handleEvent
);

export default webhooksRouter;
// start db -> env
