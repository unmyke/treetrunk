import Bottle from 'bottlejs';
import { lowerFirst } from 'lodash';

import { config } from 'config';
import { InitializeApplication } from './app/Initializer';
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
bottle.factory('initializeApplication', (container) => () =>
  new InitializeApplication(container)
);
bottle.factory('app', (container) => new Application(container));

bottle.factory('subdomains', () => subdomains);
bottle.factory('commonTypes', () => commonTypes);
bottle.factory('errorFactories', () => {
  return Object.keys(errorFactories).reduce((acc, ErrorFactoryName) => {
    const errorFactory = new errorFactories[ErrorFactoryName]();
    return { ...acc, [ErrorFactoryName]: errorFactory };
  }, {});
});

bottle.factory('mappers.commonTypes', () => {
  return Object.keys(commonTypesMappers).reduce((acc, СommonTypeName) => {
    const mapper = new commonTypesMappers[СommonTypeName]({
      commonTypes,
    });

    return { ...acc, [СommonTypeName]: mapper };
  }, {});
});
bottle.factory('mappers.subdomains', () => {
  return Object.keys(subdomainsMappers).reduce((acc, SubdomainName) => {
    const subdomainMappers = Object.keys(
      subdomainsMappers[SubdomainName]
    ).reduce((acc, EntityName) => {
      const Entity = subdomains[SubdomainName].entities[EntityName];

      const mapper = new subdomainsMappers[SubdomainName][EntityName]({
        commonTypes,
        Entity,
      });
      return { ...acc, [EntityName]: mapper };
    }, {});

    return { ...acc, [SubdomainName]: subdomainMappers };
  }, {});
});

bottle.factory(
  'repositories',
  ({
    commonTypes,
    errorFactories: { Persistence: errorFactory },
    mappers: { commonTypes: commonTypesMappers, subdomains: subdomainsMappers },
  }) => {
    return Object.keys(repositories).reduce((acc, SubdomainName) => {
      return {
        ...acc,
        [SubdomainName]: Object.keys(repositories[SubdomainName]).reduce(
          (acc, EntityName) => {
            const entityMapper = subdomainsMappers[SubdomainName][EntityName];
            const repository = new repositories[SubdomainName][EntityName]({
              commonTypes,
              errorFactory,
              commonTypesMappers,
              entityMapper,
            });
            return { ...acc, [EntityName]: repository };
          },
          {}
        ),
      };
    }, {});
  }
);

bottle.factory(
  'services',
  ({
    makeValidator,
    subdomains,
    commonTypes,
    errorFactories: {
      Operation: errorFactory,
      Validation: validationErrorFactory,
    },
    repositories,
  }) => {
    const subdomainsServices = Object.keys(services).reduce(
      (acc, SubdomainName) => {
        const subdomainRepositories = repositories[SubdomainName];
        const entities = subdomains[SubdomainName].entities;
        const domainServices = subdomains[SubdomainName].services;
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
                        Operations[operationName].constraints,
                        validationErrorFactory
                      ),
                      commonTypes,
                      errorFactory,
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

bottle.factory('loggerMiddleware', (container) => loggerMiddleware(container));
bottle.constant(
  'errorHandler',
  config.production ? errorHandler : devErrorHandler
);
bottle.constant('swaggerMiddleware', swaggerMiddleware);

bottle.constant('database', database);
bottle.constant('models', models);

export const container = bottle.container;
