import { Router } from 'express';
import statusMonitor from 'express-status-monitor';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import { createControllerRoutes as controller } from './utils/createControllerRoutes';

export const router = ({
  config,
  containerMiddleware,
  loggerMiddleware,
  errorHandler,
  swaggerMiddleware,
}) => {
  const router = Router();

  /* istanbul ignore if */
  if (config.env === 'development') {
    router.use(statusMonitor());
  }

  /* istanbul ignore if */
  if (config.env !== 'test') {
    router.use(loggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression())
    .use(containerMiddleware)
    .use('/docs', swaggerMiddleware);

  apiRouter.use('/sellers', controller('Seller'));
  apiRouter.use('/posts', controller('Post'));
  apiRouter.use('/seniority_types', controller('SeniorityType'));

  router.use('/api', apiRouter);

  router.use(errorHandler);

  return router;
};
