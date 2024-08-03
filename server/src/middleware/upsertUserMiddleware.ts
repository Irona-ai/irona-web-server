import { getLogger } from '@/utils/logger';
import { UserModel } from '@/models/user.model';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { RequestHandler } from 'express';
import { delay } from '@/utils/common.utils';

const logger = getLogger('upsertUserMiddleware');
/**
 * Upsert user middleware
 * Check if user exists in db in 2sec interval, if not retry 5 times
 * if all retries fail, create user in db with primary email address from clerk
 */
const upsertUserMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const { userId } = req.auth;

        let isExist = false;
        let retry = 5;
        const retryInterval = 2000;

        while (!isExist && retry > 0) {
            retry--;
            const user = await UserModel.getUser(userId!);
            if (user) {
                isExist = true;
            } else {
                await delay(retryInterval);
            }
        }
        if (!isExist) {
            /**
             * Get user from clerk
             */
            const user = await clerkClient.users.getUser(userId!);
            const primaryEmailAddress = user.primaryEmailAddress?.emailAddress!;
            /**
             * Create user in db
             */
            await UserModel.createUser({
                userId: userId!,
                primaryEmailAddress: primaryEmailAddress,
            });
            logger.info(userId, '-> User created');
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default upsertUserMiddleware;
