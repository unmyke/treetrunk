import initTests from './init';
import queries from './queries';
import mutations from './mutations';

const { url, ...opts } = initTests(describes);

describe(`GraphQL endpoint ${url}`, () => {
  describes(opts);
});
