import container from '@container';
import getServerUrl from './get-server-url';
import queryTests from './queries';
import mutationTests from './mutations';
import { queries, mutations } from './generators';
import * as mocks from './mocks';
import * as matchers from './matchers';

const {
  config: { api },
  entities: {
    SellerManagement: { Post },
  },
  commonTypes: { PostId },
  tests: {
    interfaces: { getApolloClient },
  },
} = container;

const ctx = { getApolloClient, queries, mutations, mocks };
Post.dismissPostId = new PostId();
expect.extend(matchers);

describe(`GraphQL endpoint ${getServerUrl(api)}`, () => {
  queryTests(ctx);
  mutationTests(ctx);
});
