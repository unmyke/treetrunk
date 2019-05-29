import { createTestClient } from 'apollo-server-testing';

import container from '@container';
import Server from '../server';

import * as queries from './queries';
import mappers from './mappers';

const {
  config,
  logger,
  schema,
  tests: {
    jest: { getTest, getContext, getDescribe },
  },
} = container;

const getUrl = ({ protocol, host, port, uri }) =>
  `${protocol || 'http'}://${host && 'localhost'}${port && `:${port}`}${uri}`;
const getTestClient = (services) => {
  const server = Server({
    config,
    logger,
    services,
    errors,
    schema,
  }).apolloServer;

  return createTestClient(server);
};

const testConfig = {
  url: getUrl(config.api),
  utils: {
    getTest,
    getTests,
    getContext,
    getContexts,
    getDescribe,
    getDescribes,
    getTestClient,
  },
  mappers,
  queries,
};

export default testConfig;
