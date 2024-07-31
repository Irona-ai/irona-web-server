import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type ZodError, type ZodSchema } from 'zod';

import { ApiResponse } from '@/common/models/serviceResponse';
export const validateRequest =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (err) {
            const errorMessage = `Invalid input: ${(err as ZodError).errors
                .map((e) => e.message)
                .join(', ')}`;
            const statusCode = StatusCodes.BAD_REQUEST;
            const failureResponse = ApiResponse.failure(
                errorMessage,
                null,
                statusCode
            );
            return res.status(statusCode).json(failureResponse);
        }
    };
