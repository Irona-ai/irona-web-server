import { Router } from 'express';
import ApiTokensController from '@/controllers/apiTokens.controller';

const apiTokensRouter = Router();

apiTokensRouter.get('/', ApiTokensController.getApiTokens);
apiTokensRouter.post('/', ApiTokensController.createApiToken);
apiTokensRouter.delete('/:apiTokenId', ApiTokensController.archiveApiToken);
apiTokensRouter.post('/validate', ApiTokensController.validateApiToken);

export default apiTokensRouter;
