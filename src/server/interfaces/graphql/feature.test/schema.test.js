import container from '@container';
import { GET_POST_BY_ID } from './queries';

const {
  tests: {
    interfaces: {
      apolloClient: { query },
    },
  },
} = container;
const variables = { id: 'ae5552f1-5fa6-430b-ae9a-218a83d5d444' };

query({ query: postQuery(GET_POST_BY_ID), variables }).then((res) => {
  console.log(res);
});

// graphql(apolloServer.schema, query).then((res) => {
//   console.log(res);
// });
