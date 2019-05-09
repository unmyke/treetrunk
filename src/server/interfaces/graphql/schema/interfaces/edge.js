import { interfaceType } from 'nexus';

import NodeInterface from './node';

const Edge = interfaceType({
  name: 'EdgeInterface',
  definition(t) {
    t.cursor('cursor');
    t.node('node', { type: NodeInterface });
  },
});

export default Edge;
