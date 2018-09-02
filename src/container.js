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
      })
  );
});

bottle.factory(
  'services',
  ({ makeValidator, subdomains, commonTypes, errors, repositories }) => {
    const subdomainsServices = Object.keys(services).reduce(
      (acc, SubdomainName) => {
        const subdomainRepositories = repositories[SubdomainName];
        const entities = subdomains[SubdomainName];
        const subdomainServices = Object.keys(services[SubdomainName]).reduce(
          (acc, EntityName) => {
            const Operations = services[SubdomainName][EntityName];

            const operations = Object.keys(Operations).reduce(
              (acc, operationName) => {
                return {
                  ...acc,
                  [lowerFirst(operationName)]: () =>
                    new Operations[operationName]({
                      validate: makeValidator(
                        Operations[operationName].constraints
                      ),
                      commonTypes,
                      errors,
                      repositories: subdomainRepositories,
                      entities,
                      domainServices,
                    }),
                };
              },
              {}
            );
            return { ...acc, [EntityName]: operations };
          },
          {}
        );
        return { ...acc, [SubdomainName]: subdomainServices };
      },
      {}
    );
    return subdomainsServices;
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

export const container = bottle.container;
