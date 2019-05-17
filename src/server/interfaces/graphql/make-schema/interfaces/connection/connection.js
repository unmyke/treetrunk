import { interfaceType } from 'nexus';

import EdgeInterface from '../edge';
import PageInfo from './page-info';

const ConnectionInterface = interfaceType({
  name: 'ConnectionInterface',
  definition(t) {
    t.list.field('edges', { type: EdgeInterface });
    t.field('pageInfo', { type: PageInfo });
    // t.resolveType(() => null);
    t.resolveType(({ __type }) => __type);
  },
});

export default ConnectionInterface;
