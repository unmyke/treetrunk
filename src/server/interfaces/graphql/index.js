import { ApolloServer } from 'apollo-server';

import schema from './schema';
import * as serializers from './serializers';

export default ({ config, logger, services }) => {
  const server = new ApolloServer({
    schema,
    // resolvers,
    context: {
      services,
      serializers,
    },
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
