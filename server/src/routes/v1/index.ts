import { ApiResponse } from '@/common/models/serviceResponse';
import { getLogger } from '@/utils/logger';
import { clerkClient } from '@clerk/clerk-sdk-node';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
const logger = getLogger('v1');

const v1Router = express.Router();

v1Router.get('/users', async (req, res) => {
    logger.info('req.auth', req.auth.userId);

    const userList = await clerkClient.users.getUser(req.auth.userId!);
    const response = ApiResponse.success('', userList, StatusCodes.OK);
    res.status(response.statusCode).json(response);
});
export default v1Router;
