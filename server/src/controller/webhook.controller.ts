import { Webhook } from 'svix'
import { Request, Response } from 'express'
import { env } from '@/common/utils/envConfig'
import { WebhookEvent } from '@clerk/clerk-sdk-node'
import { pino } from 'pino'
import { UserModel } from '@/models/user.model'
const logger = pino({ name: 'clerk webhooks' })

class WebhookController {
    static verifyWebhook = async (req: Request, res: Response) => {
        try {
            const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET
            if (!WEBHOOK_SECRET) {
                throw new Error('You need a WEBHOOK_SECRET in your .env')
            }

            // Get the headers and body
            const headers = req.headers
            const payload = req.body

            // Get the Svix headers for verification
            const svix_id = headers['svix-id'] as string
            const svix_timestamp = headers['svix-timestamp'] as string
            const svix_signature = headers['svix-signature'] as string

            // If there are no Svix headers, error out
            if (!svix_id || !svix_timestamp || !svix_signature) {
                return new Response('Error occured -- no svix headers', {
                    status: 400,
                })
            }

            // Create a new Svix instance with your secret.
            const wh = new Webhook(WEBHOOK_SECRET)

            let evt: any

            // Attempt to verify the incoming webhook
            // If successful, the payload will be available from 'evt'
            // If the verification fails, error out and  return error code

            try {
                evt = wh.verify(payload, {
                    'svix-id': svix_id,
                    'svix-timestamp': svix_timestamp,
                    'svix-signature': svix_signature,
                })
            } catch (err: any) {
                console.log('Error verifying webhook:', err.message)
                return res.status(400).json({
                    success: false,
                    message: err.message,
                })
            }
            WebhookController.handleEvent(evt)

            return res.status(200).json({
                success: true,
                message: 'Webhook received',
            })
        } catch (err: any) {
            logger.error('Error verifying webhook:', err.message)
            return res.status(400).json({
                success: false,
                message: err.message,
            })
        }
    }

    static handleEvent = async (evt: WebhookEvent) => {
        const { data: eventData, type: eventType } = evt as WebhookEvent
        // Create a new user
        if (eventType === 'user.created') {
            const user = await UserModel.createUser({ userId: eventData.id })
            logger.info('User created:', JSON.stringify(user))
        }
        // Archive the user
        if (eventType === 'user.deleted') {
            if (eventData.id) {
                const user = await UserModel.archiveUser({
                    userId: eventData.id,
                })
                logger.info('User deleted:', JSON.stringify(user))
            }
        }
    }
}

export default WebhookController
