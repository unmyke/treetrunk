import { ApolloServer } from 'apollo-server';

import * as serializers from './serializers';
import makeSchema from './make-schema';

const server = ({
  config,
  logger,
  services,
  errors,
  getCrudServiceName: getServiceName,
}) => {
  const schema = makeSchema(getServiceName);
  const apolloServer = new ApolloServer({
    schema,
    dataSources: () => ({ services }),
    context: {
      services,
      serializers,
      errors,
    },
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
    get: () => apolloServer,
    start,
    stop,
  });
};
export default server;
