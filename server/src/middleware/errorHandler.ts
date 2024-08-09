import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ClerkError } from '@/constants/clerk.constants';
import { ApiResponse } from '@/common/models/serviceResponse';
import { getLogger } from '../utils/logger';

const logger = getLogger('errorMiddleware');

export const unexpectedRequest: RequestHandler = (_req, res) => {
    return res.sendStatus(StatusCodes.NOT_FOUND);
};

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(err.message);

    let response = ApiResponse.failure(
        'Internal Server Error',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
    );

    if (err instanceof ApiResponse) {
        response = err;
    } else if (err.message === ClerkError.Unauthenticated) {
        response = ApiResponse.failure(
            'Unauthenticated!',
            null,
            StatusCodes.UNAUTHORIZED
        );
    }

    return res.status(response.statusCode).json(response);
};
