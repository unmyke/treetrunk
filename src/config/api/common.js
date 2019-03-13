export default {
  host: process.env.API_HOST || 'localhost',
  port: process.env.API_PORT || 4000,
  uri: process.env.API_URI || '/graphql',
};
