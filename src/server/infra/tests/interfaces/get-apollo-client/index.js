import { createTestClient } from 'apollo-server-testing';
import { Server } from '@interfaces/graphql';
import getMockServices from './get-mock-services';

const getApolloClient = ({ config, logger, errors, schema }) => (services) => {
  const mockServices = getMockServices(services);

  const server = Server({
    config,
    logger,
    services: mockServices,
    errors,
    schema,
  }).apolloServer;

  const { query, mutation } = createTestClient(server);

  return { query, mutation, mockServices };
};
export default getApolloClient;
