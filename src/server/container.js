/* eslint-disable import/namespace */
/* eslint-disable no-shadow */
import Bottle from 'bottlejs';
import { getSubdomainsContainer } from '@infra/support/container-helpers';

import config from '@config';
import { entities, commonTypes, states, errors } from '@domain';

import {
  Application,
  services,
  getCrudServices,
  getCrudServiceName,
} from '@app';
import makeValidator from '@infra/support/make-validator';

import Server from '@interfaces/graphql';
// import router from '@interfaces/http/router';
import Logger from '@infra/logging';
// import { entities as entitiesSerializers } from '@interfaces/http/serializers';

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

bottle.constant('entities', entities);
bottle.constant('commonTypes', commonTypes);
bottle.constant('states', states);
bottle.constant('errors', errors);

bottle.factory('app', Application);
bottle.constant('getCrudServiceName', getCrudServiceName);

// bottle.factory('mappers.commonTypes', ({ commonTypes }) =>
//   getCommonTypesContainer(commonTypesMappers, (Mapper) =>
//     Mapper({ commonTypes })
//   )
// );

bottle.factory('mappers', ({ entities, commonTypes }) =>
  getSubdomainsContainer(mappers, (Mapper, SubdomainName, EntityName) =>
    Mapper({ commonTypes, Entity: entities[SubdomainName][EntityName] })
  )
);

bottle.factory('repositories', ({ entities, models, mappers }) =>
  getSubdomainsContainer(
    repositories,
    (Repository, SubdomainName, EntityName) =>
      Repository({
        Entity: entities[SubdomainName][EntityName],
        Model: models[EntityName],
        models,
        mapper: mappers[SubdomainName][EntityName],
        mappers,
        database,
        errors,
      })
  )
);

// bottle.factory('serializers', () =>
//   getSubdomainsContainer(entitiesSerializers, (Serializer) => Serializer())
// );

bottle.factory(
  'services',
  ({ entities, commonTypes, repositories }) =>
    Object.keys(services).reduce((prevSubdomainOperations, SubdomainName) => {
      const SubdomainOperations = services[SubdomainName];
      const SubdomainEntities = entities[SubdomainName];
      const SubdomainRepos = repositories[SubdomainName];

      return {
        ...prevSubdomainOperations,
        ...Object.keys(SubdomainOperations).reduce(
          (prevEntitiesOperations, EntityName) => {
            const EntityOperations = SubdomainOperations[EntityName];

            return {
              ...prevEntitiesOperations,
              ...getCrudServices(EntityName, {
                entities: SubdomainEntities,
                commonTypes,
                repositories: SubdomainRepos,
              }),
              ...Object.keys(EntityOperations).reduce(
                (prevEntityOperations, operationName) => {
                  const EntityOperation = EntityOperations[operationName];

                  return {
                    ...prevEntityOperations,
                    [operationName]: EntityOperation({
                      entities: SubdomainEntities,
                      commonTypes,
                      repositories: SubdomainRepos,
                    }),
                  };
                },
                {}
              ),
            };
          },
          {}
        ),
      };
    }, {})
  // getSubdomainsContainer(services, (EntityOperations, SubdomainName) =>
  //   Object.keys(EntityOperations).reduce(
  //     (acc, operationName) => ({
  //       ...acc,
  //       [lowerFirst(operationName)]: EntityOperations[operationName]({
  //         entities: entities[SubdomainName],
  //         commonTypes,
  //         repositories: repositories[SubdomainName],
  //       }),
  //     }),
  //     {}
  //   )
  // )
);

bottle.constant('makeValidator', makeValidator);

bottle.factory('server', Server);
bottle.factory('logger', Logger);
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
