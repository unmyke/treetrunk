import { Router } from 'express';
import statusMonitor from 'express-status-monitor';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import { createControllerRoutes as controller } from './utils/create-controller-routes';
import { getRoutes } from './utils/get-routes';

export const router = ({
  config,
  containerMiddleware,
  loggerMiddleware,
  errorHandler,
  swaggerMiddleware,
  logger,
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

  controller(apiRouter);
  router.use('/api', apiRouter);

  router.use(errorHandler);

  logger.info(JSON.stringify(getRoutes(router)));
  return router;
};
