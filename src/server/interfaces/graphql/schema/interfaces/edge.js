import { interfaceType } from 'nexus';

import NodeInterface from './node';

const Edge = interfaceType({
  name: 'EdgeInterface',
  definition(t) {
    t.cursor('cursor');
    t.field('node', {
      type: NodeInterface,
      resolve: (root) => root,
    });
    t.resolveType(({ __type }) => __type);
  },
});

export default Edge;
