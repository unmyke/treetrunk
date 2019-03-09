import { ApolloServer } from 'apollo-server';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

export default ({ config, logger, services }) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      services,
    },
  });
  console.log(services.SellerManagement.Post.getPost.toString());

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
