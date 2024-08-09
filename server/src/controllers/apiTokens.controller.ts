import { ApiResponse } from '@/common/models/serviceResponse';
import { ApiTokenModel } from '@/models/apiToken.model';
import { env } from '@/utils/envConfig';
import { ApiTokenPayload, ApiTokenSchema } from '@/validators/user.validator';
import { RequestHandler } from 'express';
import { getLogger } from '@/utils/logger';
import { generateApiKey, generateHashedToken } from '@/utils/crypto.utils';
import { StatusCodes } from 'http-status-codes';
import { errorBoundary } from '@/utils/common.utils';

const logger = getLogger('apiTokensController');

class ApiTokensController {
    static createApiToken: RequestHandler = async (req, res) => {
        logger.info(
            '[createApiToken] Creating Api Token for user: ',
            req.auth.userId
        );

        const apiKey = generateApiKey();
        const secretToken = generateHashedToken(apiKey, env.SALT);

        // Create api token object
        const apiTokenObject: ApiTokenPayload = {
            name: req.body.name,
            secretToken: secretToken,
            userId: req.auth.userId!,
        };

        // Validate request
        ApiTokenSchema.parse(apiTokenObject);

        // Create API token
        const apiTokenResponse =
            await ApiTokenModel.createApiToken(apiTokenObject);
        // Appending api key to response
        const responseData = { ...apiTokenResponse, apiKey: apiKey };

        logger.info(
            '[createApiToken] Created Api Token for user: ',
            req.auth.userId
        );

        const response = ApiResponse.success(
            'Token created successfully',
            responseData,
            StatusCodes.CREATED
        );
        res.status(response.statusCode).json(response);
    };

    static archiveApiToken: RequestHandler = async (req, res, next) => {
        logger.info(
            '[archiveApiToken] Archiving Api Token for user: ',
            req.auth.userId
        );

        const apiTokenId = req.params.apiTokenId;

        // Archive api token
        try {
            const apiToken = await ApiTokenModel.archiveApiToken(apiTokenId);
            logger.info(
                '[archiveApiToken] Archived Api Token for user: ',
                req.auth.userId
            );

            const response = ApiResponse.success(
                'Token deleted successfully',
                apiToken.id,
                StatusCodes.NO_CONTENT
            );
            res.status(response.statusCode).json(response);
        } catch (error: any) {
            if (error.code === 'P2025') {
                logger.error(
                    '[archiveApiToken] P2025 Api Token not found for user: ',
                    req.auth.userId
                );
                const response = ApiResponse.failure(
                    'Api token not found',
                    null,
                    StatusCodes.BAD_REQUEST
                );
                return next(response);
            }
            throw error;
        }
    };

    static getApiTokens: RequestHandler = async (req, res) => {
        // TODO: fix pino logger
        logger.info(
            `[getApiTokens] Getting Api Tokens for user: ${req.auth.userId}`
        );

        // Get all api tokens for user
        const apiTokens = await ApiTokenModel.getApiTokensByUserId(
            req.auth.userId!
        );
        logger.info(
            '[getApiTokens] Got Api Tokens for user: ',
            req.auth.userId
        );
        const response = ApiResponse.success('', apiTokens, StatusCodes.OK);
        res.status(response.statusCode).json(response);
    };

    // TODO: Private
    static validateApiToken: RequestHandler = async (req, res) => {
        const secretToken = generateHashedToken(req.body.apiKey, env.SALT);

        const resp = await ApiTokenModel.getApiTokenBySecretToken(secretToken);

        const response = ApiResponse.success('', resp, StatusCodes.OK);
        res.status(response.statusCode).json(response);
    };
}

export default {
    getApiTokens: errorBoundary(ApiTokensController.getApiTokens, logger),
    createApiToken: errorBoundary(ApiTokensController.createApiToken, logger),
    archiveApiToken: errorBoundary(ApiTokensController.archiveApiToken, logger),
    validateApiToken: errorBoundary(
        ApiTokensController.validateApiToken,
        logger
    ),
};
