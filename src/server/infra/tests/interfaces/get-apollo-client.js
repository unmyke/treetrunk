import { createTestClient } from 'apollo-server-testing';

const getApolloClient = ({ config, logger, errors, schema }) => (services) => {
  const server = Server({
    config,
    logger,
    services,
    errors,
    schema,
  }).apolloServer;

  return createTestClient(server);
};
export default getApolloClient;
