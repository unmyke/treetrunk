import container from '@container';
import getServerUrl from './get-server-url';
import queryTests from './queries';
import mutationTests from './mutations';
import { queries, mutations } from './generators';

const {
  config: { api },
  tests: {
    interface: { getApolloClient },
  },
} = container;

describe(`GraphQL endpoint ${getServerUrl(api)}`, () => {
  queryTests({ getApolloClient, queries, mutations });
  mutationTests({ getApolloClient, queries, mutations });
});
