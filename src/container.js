import { createContainer, Lifetime, asValue, asFunction, asClass } from 'awilix';
import { scopePerRequest } from 'awilix-express';

import config from '../config';
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
// import * as repositories from './infra/repositories';
// import { db } from 'src/infra/database/models';
// const { database, models } = db;

const container = createContainer();

console.log(container);

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
// container.registerValue({
//   database,
//   SellerModel
// });

// Operations
container.registerClass({
  createSeller: CreateSeller,
  // getAllSellers: GetAllSellers,
  // getSeller: GetSeller,
  // updateSeller: UpdateSeller,
  // deleteSeller: DeleteSeller
});

// Serializers
container.registerValue({
  sellerSerializer: SellerSerializer
});

module.exports = container;
