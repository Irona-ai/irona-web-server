import { ApiResponse } from '@/common/models/serviceResponse';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { Logger } from 'pino';

export const delay = (ms: number = 2000) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const errorBoundary = (
    handler: RequestHandler,
    logger: Logger
): RequestHandler => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error: any) {
            logger.error(error);
            // logger.error(error.message);

            if (error instanceof ZodError) {
                const failureResponse = ApiResponse.failure(
                    'Invalid input',
                    error.issues,
                    StatusCodes.BAD_REQUEST
                );
                return next(failureResponse);
            }
            next(error);
        }
    };
};
