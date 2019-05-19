const { createTestClient } = require('apollo-server-testing');

const apolloClient = ({ server }) => createTestClient(server.get());
export default apolloClient;
