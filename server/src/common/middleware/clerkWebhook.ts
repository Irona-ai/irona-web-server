import { Request, Response, NextFunction } from 'express';
import { env } from '@/common/utils/envConfig';
import { Webhook } from 'svix';
import { pino } from 'pino';
const logger = pino({ name: 'clerk webhooks' });

export const clerkWebhookMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error('You need a WEBHOOK_SECRET in your .env');
        }

        // Get the headers and body
        const headers = req.headers;
        const payload = req.body;

        // Get the Svix headers for verification
        const svix_id = headers['svix-id'] as string;
        const svix_timestamp = headers['svix-timestamp'] as string;
        const svix_signature = headers['svix-signature'] as string;

        // If there are no Svix headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            throw new Error('Error occured -- no svix headers');
        }

        // Create a new Svix instance with your secret.
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt: any;

        // Attempt to verify the incoming webhook
        // If successful, the payload will be available from 'evt'
        // If the verification fails, error out and  return error code

        evt = wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });

        res.locals.clerkWebhookEvt = evt;
        next();
    } catch (err: any) {
        logger.error('Error verifying webhook:', err.message);
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
