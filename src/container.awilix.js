import { createContainer, asValue, asFunction, asClass } from 'awilix';
import { scopePerRequest } from 'awilix-express';

import { config } from '../config';
import { Application } from './app/Application';
import * as services from './app';

import * as serializers from './interfaces/http/serializers';

import { Server } from './interfaces/http/Server';
import { router } from './interfaces/http/router';
import { loggerMiddleware } from './interfaces/http/logging/loggerMiddleware';
import { errorHandler } from './interfaces/http/errors/errorHandler';
import { devErrorHandler } from './interfaces/http/errors/devErrorHandler';
import { swaggerMiddleware } from './interfaces/http/swagger/swaggerMiddleware';

import { logger } from './infra/logging/logger';
import { lowercaseFirstLetter } from './infra/support/changeCaseFirstLetter';
// import { Operation } from './app/lib/Operation';
// import * as repositories from './infra/repositories';
import { db } from './infra/database/models';
const { database, models } = db;

export const container = createContainer();

// System
container
  .register({
    app:    asClass(Application).singleton(),
    server: asClass(Server).singleton(),
  })
  .register({
    router: asFunction(router).singleton(),
    logger: asFunction(logger).singleton(),
  })
  .register({
    config: asValue(config),
  });

// Middlewares
container
  .register({
    loggerMiddleware: asFunction(loggerMiddleware).singleton(),
  })
  .register({
    containerMiddleware: asValue(scopePerRequest(container)),
    errorHandler: asValue(config.production ? errorHandler : devErrorHandler),
    swaggerMiddleware: asValue([swaggerMiddleware]),
  });

// Repositories
// container.register({
//   sellersRepository: asClass(SequelizeSellersRepository).singleton(),
// });

// Database
container.register({
  database: asValue(database),
  models: asValue(models),
});

// Operations
Object.keys(services).forEach(entityName => {
  Object.keys(services[entityName]).forEach(operation => {
    container.register({
      [`services.${entityName}.${lowercaseFirstLetter(operation)}`]: asClass(services[entityName][operation])
    });
  });
});

// Serializers
Object.keys(serializers).forEach(entityName => {
  container.register({
    [`serializers.${lowercaseFirstLetter(entityName)}`]: asValue(serializers[entityName])
  });
});
