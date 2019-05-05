import { interfaceType } from 'nexus';

import Node from './node';

const Edge = interfaceType({
  name: 'Edge',
  definition(t) {
    t.cursor('cursor');
    t.node('node', Node);
    t.resolveType(() => null);
  },
});

export default Edge;
