import testConfig from './test-config';
import queries from './queries';
import mutations from './mutations';

const { url, ...config } = testConfig;
const {
  utils: { getDescribe },
} = config;

const describeItem = getDescribe({
  name: `GraphQL endpoint ${url}`,
  callback: [queries(config), mutations(config)],
});

describeItem(config);
