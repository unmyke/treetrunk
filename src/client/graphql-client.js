import ApolloClient from 'apollo-boost';

const graphqlClient = new ApolloClient({ uri: 'http://localhost' });
export default graphqlClient;
