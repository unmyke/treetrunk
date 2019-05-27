import { createTestClient } from 'apollo-server-testing';

import container from '@container';
import Server from '../server';

import * as queries from './queries';
import mappers from './mappers';

const { config, logger, schema } = container;

const getOperation = (services) => {
  const server = Server({
    config,
    logger,
    services,
    errors,
    schema,
  }).apolloServer;

  const { query, mutation } = createTestClient(server);
  return { query, mutation };
};

describe(`graphQl endpoint`, (tests) => {
  tests({
    getOperation,
    mappers,
    queries,
  });
});
