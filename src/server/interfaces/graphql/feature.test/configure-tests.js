import container from '@container';
import getServerUrl from './get-server-url';
import * as operations from './operations';
import * as services from './services';
import * as matchers from './matchers';

const configureTests = () => {
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

  Post.dismissPostId = new PostId();
  expect.extend(matchers);
  const url = getServerUrl(api);

  const ctx = { url, getApolloClient, operations, services };
  return ctx;
};
export default configureTests;
