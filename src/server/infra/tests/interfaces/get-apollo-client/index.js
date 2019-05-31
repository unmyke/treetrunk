import { createTestClient } from 'apollo-server-testing';
import { Server } from '@interfaces/graphql';
import getMockService from './get-mock-service';

const getApolloClient = ({ config, logger, errors, schema }) => (services) => {
  const mockServices = Object.entries(services).reduce(
    (prevServices, [serviceName, service]) => ({
      ...prevServices,
      [serviceName]: getMockService(service),
    }),
    {}
  );

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
