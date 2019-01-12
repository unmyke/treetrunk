module.exports = {
  web: {
    domain: process.env.DOMAIN,
    port: process.env.PORT,
    'dev-server-port': process.env.DEV_SERVER_PORT,
    graphql: {
      path: 'graphql',
    },
  },
  logging: {},
};
