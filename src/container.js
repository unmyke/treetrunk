import Bottle from 'bottlejs';
import { lowerFirst } from 'lodash';

import { config } from 'config';
import { Application } from './app/Application';

import { subdomains, commonTypes, errorFactories } from './domain';

import * as repositories from './infra/repositories';
import * as services from './app';
import { makeValidator } from './infra/support/makeValidator';

import { Server } from './interfaces/http/Server';
import { router } from './interfaces/http/router';
import { logger } from './infra/logging/logger';

import { loggerMiddleware } from './interfaces/http/logging/loggerMiddleware';
import { errorHandler } from './interfaces/http/errors/errorHandler';
import { devErrorHandler } from './interfaces/http/errors/devErrorHandler';
import { swaggerMiddleware } from './interfaces/http/swagger/swaggerMiddleware';

// import * as serializers from './interfaces/http/serializers';

import { db } from './infra/database/models';
const { database, models } = db;
import {
  commonTypes as commonTypesMappers,
  subdomains as subdomainsMappers,
} from './infra/mappers';

import { containerMiddleware } from './interfaces/http/utils/bottle-express';

const bottle = new Bottle();

bottle.constant('config', config);
bottle.factory('app', (container) => new Application(container));
bottle.factory('subdomains', () => subdomains);
bottle.factory('commonTypes', () => commonTypes);
bottle.factory('errorFactories', () => {
  return Object.keys(errorFactories).reduce((acc, ErrorFactoryName) => {
    const errorFactory = new errorFactories[ErrorFactoryName]();
    return { ...acc, [ErrorFactoryName]: errorFactory };
  }, {});
});
// bottle.factory('domain.services', (container) => {
//   return Object.keys(domainServices).reduce((acc, domainServiceName) => {
//     const domainService = new domainServices[domainServiceName](container);
//     return { ...acc, [domainServiceName]: domainService };
//   }, {});
// });

bottle.factory('mappers.commonTypes', (container) => {
  return Object.keys(commonTypesMappers).reduce((acc, commonTypeName) => {
    const mapper = new commonTypesMappers[commonTypeName](container);
    return { ...acc, [commonTypeName]: mapper };
  }, {});
});

bottle.factory('mappers.subdomains', (container) => {
  return Object.keys(subdomainsMappers).reduce((acc, subdomainName) => {
    const subdomainMappers = Object.keys(
      subdomainsMappers[subdomainName]
    ).reduce((acc, EntityName) => {
      const mapper = new subdomainsMappers[subdomainName][EntityName](
        container
      );
      return { ...acc, [EntityName]: mapper };
    }, {});

    return { ...acc, [subdomainName]: subdomainMappers };
  }, {});
});

bottle.factory('repositories', (container) => {
  return Object.keys(repositories).reduce((acc, subdomainName) => {
    return {
      ...acc,
      [subdomainName]: Object.keys(repositories[subdomainName]).reduce(
        (acc, repositoryName) => {
          const repository = new repositories[subdomainName][repositoryName](
            container
          );
          return { ...acc, [repositoryName]: repository };
        },
        {}
      ),
    };
  }, {});
});

bottle.factory('services', (container) => {
  const result = Object.keys(services).reduce((acc, entityName) => {
    const Operations = services[entityName];
    const operations = Object.keys(Operations).reduce((acc, operationName) => {
      return {
        ...acc,
        [lowerFirst(operationName)]: () =>
          new Operations[operationName](container),
      };
    }, {});
    return { ...acc, [entityName]: operations };
  }, {});
  return result;
});

// Object.keys(services).forEach((entityName) => {
//   const Operations = services[entityName];
//   const serializer = serializers[entityName];
//   Object.keys(Operations).forEach((operationName) => {
//     const Operation = Operations[operationName];
//     bottle.factory(`services.${entityName}.${lowerFirst(operationName)}`, (container) => {
//       const { repositories, entities } = container;
//       console.log(container);
//       console.log(repositories);
//       console.log(entities);

//       return { instance: () => new Operation({ repositories, entities, serializer }), }
//     });
//   });
// });

// bottle.constant('serializers', serializers);

bottle.constant('makeValidator', makeValidator);

bottle.factory('server', (container) => new Server(container));
bottle.factory('logger', (container) => logger(container));
bottle.factory('router', (container) => router(container));
bottle.factory('containerMiddleware', (container) =>
  containerMiddleware(container)
);

bottle.factory('loggerMiddleware', (container) => loggerMiddleware(container));
bottle.constant(
  'errorHandler',
  config.production ? errorHandler : devErrorHandler
);
bottle.constant('swaggerMiddleware', swaggerMiddleware);

bottle.constant('database', database);
bottle.constant('models', models);
// bottle.factory('mappers', ({ entities }) => {
//   const result = Object.keys(mappers).reduce((acc, mapperName) => {
//     const Entity = entities[mapperName];
//     const mapper = new mappers[mapperName](Entity);
//     return { ...acc, [mapperName]: mapper };
//   }, {});
//   return result;
// });

export const container = bottle.container;
