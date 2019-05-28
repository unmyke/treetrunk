import { createTestClient } from 'apollo-server-testing';

import container from '@container';
import Server from '../server';

import * as queries from './queries';
import mappers from './mappers';

const { config, logger, schema } = container;

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

const otps = {
  url: getUrl(config.api),
  getTestClient,
  mappers,
  queries,
};

export default otps;
