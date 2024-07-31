import { RequestHandler } from 'express';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { pino } from 'pino';
import { UserModel } from '@/models/user.model';
const logger = pino({ name: 'clerk webhooks' });

class WebhookController {
    static handleEvent: RequestHandler = async (_req, res) => {
        try {
            // prettier-ignore
            const { data: eventData, type: eventType } = res.locals.clerkWebhookEvt as WebhookEvent;
            logger.info({ eventType });

            // Create a new user
            if (eventType === 'user.created') {
                const user = await UserModel.createUser({
                    userId: eventData.id,
                });
                logger.info(user, 'User created:');
            }
            // Archive the user
            if (eventType === 'user.deleted') {
                if (eventData.id) {
                    const user = await UserModel.archiveUser({
                        userId: eventData.id,
                    });
                    logger.info(user, 'User deleted:');
                }
            }
            return res.status(200).json({
                success: true,
                message: 'Webhook received',
            });
        } catch (error: any) {
            // check error.message
            if (error.message === 'Database Error') {
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error: Database Error',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Webhook received',
            });
        }
    };
}

export default WebhookController;
