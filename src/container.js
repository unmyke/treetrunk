import Bottle from 'bottlejs';
import { lowerFirst } from 'lodash';
import {
  getSubdomainsContainer,
  getCommonTypesContainer,
} from './infra/support/containerHelpers';

import { config } from 'config';
import { InitializeApplication } from './app/Initializer';
import { Application } from './app/Application';
import * as services from './app';

import { subdomains, commonTypes, states, errors } from './domain';

import * as repositories from './infra/repositories';
import { makeValidator } from './infra/support/makeValidator';

import { Server } from './interfaces/http/Server';
import { router } from './interfaces/http/router';
import { logger } from './infra/logging/logger';

import { loggerMiddleware } from './interfaces/http/logging/loggerMiddleware';
import { errorHandler } from './interfaces/http/errors/errorHandler';
import { devErrorHandler } from './interfaces/http/errors/devErrorHandler';
import { swaggerMiddleware } from './interfaces/http/swagger/swaggerMiddleware';

import { subdomains as subdomainsSerializers } from './interfaces/http/serializers';

import { database, models } from './infra/database';
import {
  commonTypes as commonTypesMappers,
  subdomains as subdomainsMappers,
} from './infra/mappers';

import { containerMiddleware } from './interfaces/http/utils/bottle-express';

const bottle = new Bottle();

bottle.constant('config', config);
bottle.factory('initializeApplication', (container) => () =>
  new InitializeApplication(container)
);
bottle.factory('app', (container) => new Application(container));

bottle.factory('subdomains', () => subdomains);
bottle.factory('commonTypes', () => commonTypes);
bottle.factory('states', () => states);
bottle.constant('errors', errors);

bottle.factory('mappers.commonTypes', () => {
  return getCommonTypesContainer(
    commonTypesMappers,
    (Mapper) => new Mapper({ commonTypes })
  );
});

bottle.factory('mappers.subdomains', () => {
  return getSubdomainsContainer(
    subdomainsMappers,
    (Mapper, SubdomainName, EntityName) => {
      const Entity = subdomains[SubdomainName][EntityName];

      return new Mapper({ commonTypes, Entity });
    }
  );
});

bottle.factory('repositories', ({ mappers }) => {
  return getSubdomainsContainer(
    repositories,
    (Repository, SubdomainName, EntityName) =>
      new Repository({
        Model: models[SubdomainName][EntityName],
        models,
        mapper: mappers.subdomains[SubdomainName][EntityName],
        mappers,
      })
  );
});

bottle.factory('serializers', () => {
  return getSubdomainsContainer(
    subdomainsSerializers,
    (Serializer) => new Serializer()
  );
});

bottle.factory(
  'services',
  ({ makeValidator, subdomains, commonTypes, errors, repositories }) => {
    return getSubdomainsContainer(
      services,
      (EntityOperations, SubdomainName) => {
        return Object.keys(EntityOperations).reduce((acc, operationName) => {
          return {
            ...acc,
            [lowerFirst(operationName)]: () =>
              new EntityOperations[operationName]({
                entities: subdomains[SubdomainName],
                commonTypes,
                repositories: repositories[SubdomainName],
                validate: makeValidator(
                  EntityOperations[operationName].constraints,
                  errors
                ),
                errors,
              }),
          };
        }, {});
      }
    );
  }
);

bottle.constant('makeValidator', makeValidator);

bottle.factory('server', (container) => new Server(container));
bottle.factory('logger', (container) => logger(container));
bottle.factory('router', (container) => router(container));
bottle.factory('containerMiddleware', (container) =>
  containerMiddleware(container)
);
// bottle.constant('serializers', serializers);

bottle.factory('loggerMiddleware', (container) => loggerMiddleware(container));
bottle.constant(
  'errorHandler',
  config.production ? errorHandler : devErrorHandler
);
bottle.constant('swaggerMiddleware', swaggerMiddleware);

bottle.constant('database', database);
bottle.constant('models', models);

export default bottle.container;
