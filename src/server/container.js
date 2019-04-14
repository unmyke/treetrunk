/* eslint-disable import/namespace */
/* eslint-disable no-shadow */
import Bottle from 'bottlejs';
import { lowerFirst } from 'lodash';
import { getSubdomainsContainer } from '@infra/support/container-helpers';

import config from '@config';
import { subdomains, commonTypes, states, errors } from '@domain';

import Application, * as services from '@app';
import makeValidator from '@infra/support/make-validator';

import Server from '@interfaces/graphql';
// import router from '@interfaces/http/router';
import Logger from '@infra/logging';
// import { subdomains as subdomainsSerializers } from '@interfaces/http/serializers';

// import { containerMiddleware } from '@interfaces/http/utils/bottle-express';
// import loggerMiddleware from '@interfaces/http/logging/logger-middleware';
// import swaggerMiddleware from '@interfaces/http/swagger/swagger-middleware';
// import errorHandler from '@interfaces/http/errors/error-handler';
// import devErrorHandler from '@interfaces/http/errors/dev-error-handler';

import repositories from '@infra/repositories';
import getDatabase from '@infra/database';
import mappers from '@infra/mappers';

const { database, models } = getDatabase({ config, errors });

const bottle = new Bottle();

bottle.constant('config', config);
bottle.factory('app', (container) => Application(container));

bottle.factory('subdomains', () => subdomains);
bottle.factory('commonTypes', () => commonTypes);
bottle.factory('states', () => states);
bottle.constant('errors', errors);

// bottle.factory('mappers.commonTypes', ({ commonTypes }) =>
//   getCommonTypesContainer(commonTypesMappers, (Mapper) =>
//     Mapper({ commonTypes })
//   )
// );

bottle.factory('mappers', ({ subdomains, commonTypes }) =>
  getSubdomainsContainer(mappers, (Mapper, SubdomainName, EntityName) =>
    Mapper({ commonTypes, Entity: subdomains[SubdomainName][EntityName] })
  )
);

bottle.factory('repositories', ({ models, mappers }) =>
  getSubdomainsContainer(
    repositories,
    (Repository, SubdomainName, EntityName) =>
      Repository({
        Model: models[EntityName],
        models,
        mapper: mappers[SubdomainName][EntityName],
        mappers,
        database,
      })
  )
);

// bottle.factory('serializers', () =>
//   getSubdomainsContainer(subdomainsSerializers, (Serializer) => Serializer())
// );

bottle.factory(
  'services',
  ({ makeValidator, subdomains, commonTypes, errors, repositories }) =>
    getSubdomainsContainer(services, (EntityOperations, SubdomainName) =>
      Object.keys(EntityOperations).reduce(
        (acc, operationName) => ({
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
        }),
        {}
      )
    )
);

bottle.constant('makeValidator', makeValidator);

bottle.factory('server', (container) => Server(container));
bottle.factory('logger', (container) => Logger(container));
// bottle.factory('router', (container) => router(container));
// bottle.factory('containerMiddleware', (container) =>
//   containerMiddleware(container)
// );
// // bottle.constant('serializers', serializers);

// bottle.factory('loggerMiddleware', (container) => loggerMiddleware(container));
// bottle.constant(
//   'errorHandler',
//   config.production ? errorHandler : devErrorHandler
// );
// bottle.constant('swaggerMiddleware', swaggerMiddleware);

bottle.constant('database', database);
bottle.constant('models', models);

export default bottle.container;
