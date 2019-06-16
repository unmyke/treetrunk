import { interfaceType } from 'nexus';

import getPageInfo from './page-info';

const ConnectionInterface = (ctx) => {
  const {
    interfaces: { Edge },
  } = ctx;
  const PageInfo = getPageInfo(ctx);

  return interfaceType({
    name: 'ConnectionInterface',
    definition(t) {
      t.list.field('edges', { type: Edge });
      t.field('pageInfo', { type: PageInfo });
      // t.resolveType(() => null);
      t.resolveType(({ __type }) => __type);
    },
  });
};
export default ConnectionInterface;
