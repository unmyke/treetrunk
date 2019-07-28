/* eslint-disable import/namespace */
/* eslint-disable no-shadow */
import Bottle from 'bottlejs';
import { getSubdomainsContainer } from '@infra/support/container-helpers';

import config from '@config';
import tests from '@infra/tests';
import { entities, commonTypes, states, errors } from '@domain';

import {
  Application,
  services,
  InitializeApplication,
  getCrudServices,
  getCrudServiceName,
} from '@app';
import makeValidator from '@infra/support/make-validator';

import { Server, makeSchema } from '@interfaces/graphql';
import Logger from '@infra/logging';
import repositories from '@infra/repositories';
import getDatabase from '@infra/database';
import mappers from '@infra/mappers';

const { database, models } = getDatabase({ config, errors });
const PRODUCTION_MODE = 'production';

// Container
const bottle = new Bottle();

bottle.constant('config', config);
//    Domain Layer
bottle.constant('entities', entities);
bottle.constant('commonTypes', commonTypes);
bottle.constant('states', states);
bottle.constant('errors', errors);

bottle.factory('repositories', ({ entities, models, mappers, logger }) =>
  getSubdomainsContainer(
    repositories,
    (Repository, SubdomainName, EntityName) =>
      Repository({
        commonTypes,
        Entity: entities[SubdomainName][EntityName],
        Model: models[EntityName],
        models,
        mapper: mappers[SubdomainName][EntityName],
        mappers,
        database,
        errors,
        logger,
      })
  )
);

//  Application Layer
bottle.constant('getCrudServiceName', getCrudServiceName);
bottle.factory('app', Application);
bottle.factory('initializeApplication', InitializeApplication);
bottle.factory('services', ({ entities, commonTypes, repositories }) =>
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
);

//  Infrastructure Layer
bottle.constant('database', database);
bottle.constant('models', models);
bottle.constant('makeValidator', makeValidator);
bottle.factory('mappers', ({ entities, commonTypes }) =>
  getSubdomainsContainer(mappers, (Mapper, SubdomainName, EntityName) =>
    Mapper({ commonTypes, Entity: entities[SubdomainName][EntityName] })
  )
);
bottle.factory('logger', Logger);
if (config.mode !== PRODUCTION_MODE) bottle.factory('tests', tests);

//  Interface Layer
bottle.factory('schema', ({ getCrudServiceName }) =>
  makeSchema(getCrudServiceName)
);
bottle.factory('server', Server);

export default bottle.container;
