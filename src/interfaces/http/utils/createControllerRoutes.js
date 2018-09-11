import { Router } from 'express';
import { snakeCase } from 'lodash';

import * as Controllers from '../controllers';

export function createControllerRoutes() {
  const rootRouter = Router();
  Object.keys(Controllers).forEach((subdomainName) => {
    const subdomainRouter = Router();

    Object.keys(Controllers[subdomainName]).forEach((entityName) => {
      const entityRouter = Controllers[subdomainName][entityName].router;
      subdomainRouter.use(snakeCase(entityName.toLowerCase()), entityRouter);
    });

    rootRouter.use(snakeCase(subdomainName.toLowerCase()), subdomainRouter);
    return rootRouter;
  });

  return rootRouter;
}
