import container from '@container';
import getServerUrl from './get-server-url';
import queryTests from './queries';
import mutationTests from './mutations';
import { queries, mutations } from './generators';
import * as mocks from './mocks';

const {
  config: { api },
  tests: {
    interfaces: { getApolloClient },
  },
} = container;

const ctx = { getApolloClient, queries, mutations, mocks };

describe(`GraphQL endpoint ${getServerUrl(api)}`, () => {
  queryTests(ctx);
  mutationTests(ctx);
});
