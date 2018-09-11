import { Router } from 'express';
import pluralize from 'pluralize';
import { snakeCase, lowerFirst } from 'lodash';

import * as Controllers from '../controllers';

export function createControllerRoutes(rootRouter) {
  Object.keys(Controllers).forEach((subdomainName) => {
    const subdomainRouter = Router();

    Object.keys(Controllers[subdomainName]).forEach((entityName) => {
      const entityRouter = Controllers[subdomainName][entityName].router;
      subdomainRouter.use(
        snakeCase(lowerFirst(pluralize(entityName))),
        entityRouter
      );
      console.log(snakeCase(lowerFirst(pluralize(entityName))));
    });

    rootRouter.use(snakeCase(lowerFirst(subdomainName)), subdomainRouter);
    console.log(snakeCase(lowerFirst(subdomainName)));
    return rootRouter;
  });

  return rootRouter;
}
