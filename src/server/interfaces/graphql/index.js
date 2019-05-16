import { ApolloServer } from 'apollo-server';

import * as serializers from './serializers';
import schema from './schema';

export default ({
  config,
  logger,
  services,
  errors,
  getCrudServiceName: getServiceName,
}) => {
  const server = new ApolloServer({
    schema,
    // resolvers,
    context: {
      services,
      serializers,
      errors,
    },
    debug: config.mode !== 'production',
  });

  const start = () =>
    new Promise((resolve, reject) =>
      server.listen(config.api.port).then(
        ({ url }) => {
          logger.info(`[p ${process.pid}] GraphQL serves at ${url}`);
          resolve();
        },
        (error) => {
          logger.error(
            `[p ${process.pid}] Cannot start GraphQL server. Error: ${
              error.message
            }`
          );
          reject(error);
        }
      )
    );

  return Object.freeze({
    start,
  });
};
