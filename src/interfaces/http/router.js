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

  router.use('/api', controller());

  router.use(errorHandler);

  return router;
};
