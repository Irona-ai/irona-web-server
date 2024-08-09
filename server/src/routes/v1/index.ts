import { ApiResponse } from '@/common/models/serviceResponse';
import { getLogger } from '@/utils/logger';
import { clerkClient } from '@clerk/clerk-sdk-node';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import apiTokensRouter from './apiTokens.routes';

const logger = getLogger('v1');

const v1DashboardRouter = express.Router();

v1DashboardRouter.use('/api-tokens', apiTokensRouter);

v1DashboardRouter.get('/users', async (req, res) => {
    logger.info('req.auth', req.auth.userId);

    const userList = await clerkClient.users.getUser(req.auth.userId!);
    const response = ApiResponse.success('', userList, StatusCodes.OK);
    res.status(response.statusCode).json(response);
});

export default v1DashboardRouter;
