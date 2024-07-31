import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ClerkError } from '@/constants/clerk.constants';
import { ApiResponse } from '@/common/models/serviceResponse';
import { getLogger } from '../utils/logger';
const logger = getLogger('errorMiddleware');

export const unexpectedRequest: RequestHandler = (_req, res) => {
    res.sendStatus(StatusCodes.NOT_FOUND);
};

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(err.message);
    if (err instanceof ApiResponse) {
        return res.status(err.statusCode).json(err);
    }
    if (err.message === ClerkError.Unauthenticated) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'Unauthenticated!' });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
    });
};
