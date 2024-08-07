import { RequestHandler } from 'express';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { pino } from 'pino';
import { UserModel } from '@/models/user.model';
import { ApiResponse } from '@/common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
const logger = pino({ name: 'clerk webhooks' });

class WebhookController {
    static handleEvent: RequestHandler = async (_req, res) => {
        // prettier-ignore
        const { data: eventData, type: eventType, } = res.locals.clerkWebhookEvt as WebhookEvent;
        logger.info({ eventType }, 'Webhook processing');
        try {
            // Create a new user
            if (eventType === 'user.created') {
                const primaryEmailId = eventData.primary_email_address_id;
                const primaryEmailAddress = eventData.email_addresses.find(
                    (email) => email.id === primaryEmailId
                )?.email_address!;

                const user = await UserModel.createUser({
                    userId: eventData.id,
                    primaryEmailAddress,
                });
                logger.info(user.userId, '-> User created');
            }

            // Archive the user
            if (eventType === 'user.deleted') {
                if (eventData.id) {
                    const user = await UserModel.archiveUser(eventData.id);
                    logger.info(user.userId, '-> User deleted:');
                }
            }

            // Update the user
            if (eventType === 'user.updated') {
                const primaryEmailId = eventData.primary_email_address_id;
                const primaryEmailAddress = eventData.email_addresses.find(
                    (email) => email.id === primaryEmailId
                )?.email_address!;

                const user = await UserModel.updateUser(eventData.id, {
                    primaryEmailAddress,
                });
                logger.info(
                    user.userId,
                    '-> User updated email address to: ',
                    primaryEmailAddress
                );
            }
        } catch (error: any) {
            logger.error(eventData, error.message);
            //TODO: check error.message
            if (error.message === 'Database Error') {
                const response = ApiResponse.failure(
                    'Internal Server Error: Database Error',
                    null,
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
                return res.status(response.statusCode).json(response);
            }
        } finally {
            logger.info('Webhook processed');
            const response = ApiResponse.success(
                'Webhook processed',
                null,
                StatusCodes.OK
            );
            return res.status(response.statusCode).json(response);
        }
    };
}

export default WebhookController;
