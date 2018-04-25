import Bottle from 'bottlejs';

import { config } from 'config';
import { Application } from './app/Application';

import * as domain from './domain';
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
// import * as mappers from './infra/mappers';

import { lowercaseFirstLetter } from './infra/support/changeCaseFirstLetter';
import { containerMiddleware } from './interfaces/http/utils/bottle-express';

const bottle = new Bottle();

bottle.constant('config', config);
bottle.factory('app', (container) => new Application(container));

bottle.constant('domain', domain);

bottle.factory('repositories', ({ models, mappers, makeValidator }) => {
  const result = Object.keys(repositories).reduce((acc, repositoryName) => {
    const repository = new Repository({ Model, mapper, makeValidator });
    return { ...acc, [entityName]: repository };
  }, {});
  return result;
});

bottle.factory('services', (container) => {
  const result = Object.keys(services).reduce((acc, entityName) => {
    const Operations = services[entityName];
    const operations = Object.keys(Operations).reduce((acc, operationName) => {
      return {
        ...acc,
        [lowercaseFirstLetter(operationName)]: () =>
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
//     bottle.factory(`services.${entityName}.${lowercaseFirstLetter(operationName)}`, (container) => {
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
bottle.factory('mappers', ({ entities }) => {
  const result = Object.keys(mappers).reduce((acc, mapperName) => {
    const Entity = entities[mapperName];
    const mapper = new mappers[mapperName](Entity);
    return { ...acc, [mapperName]: mapper };
  }, {});
  return result;
});

export const container = bottle.container;
