import { Router } from 'express';
import pluralize from 'pluralize';
import { kebabCase, lowerFirst } from 'lodash';

import * as Controllers from '../controllers';

export function createControllerRoutes(rootRouter) {
  Object.keys(Controllers).forEach((subdomainName) => {
    const subdomainRouter = Router();

    Object.keys(Controllers[subdomainName]).forEach((entityName) => {
      const entityRouter = Controllers[subdomainName][entityName].router;
      subdomainRouter.use(
        `/${kebabCase(lowerFirst(pluralize(entityName)))}`,
        entityRouter
      );
    });

    rootRouter.use(`/${kebabCase(lowerFirst(subdomainName))}`, subdomainRouter);
    return rootRouter;
  });

  return rootRouter;
}
