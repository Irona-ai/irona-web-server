import express from 'express';
import { ApiResponse } from '@/common/models/serviceResponse';

const healthCheckRouter = express.Router();

healthCheckRouter.get('/', (_req, res) => {
    const serviceResponse = ApiResponse.success('Service is healthy', null);
    return res.status(serviceResponse.statusCode).json(serviceResponse);
});

export { healthCheckRouter };
