import { ApolloServer } from 'apollo-server';

import * as serializers from './serializers';

const Server = ({ config, logger, services, errors, schema }) => {
  const apolloServer = new ApolloServer({
    schema,
    dataSources: () => ({ services }),
    context: () => ({
      serializers,
      errors,
    }),
    debug: config.mode !== 'production',
  });

  const start = () =>
    new Promise((resolve, reject) =>
      apolloServer.listen(config.api.port).then(
        (apolloServer) => {
          const { url } = apolloServer;
          logger.info(`[p ${process.pid}] GraphQL serves at ${url}`);
          resolve(apolloServer);
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

  const stop = () => {
    apolloServer.close(() => {
      logger.warn(`[p ${process.pid}] GraphQL stops!`);
    });
  };

  return Object.freeze({
    apolloServer,
    start,
    stop,
  });
};
export default Server;