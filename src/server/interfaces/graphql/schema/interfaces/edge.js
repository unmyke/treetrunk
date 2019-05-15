import { interfaceType } from 'nexus';

const Edge = interfaceType({
  name: 'EdgeInterface',
  definition(t) {
    t.cursor('cursor');
    // t.field('node', {
    //   type: NodeInterface,
    //   // resolve: (root) => root,
    // });
    t.resolveType(({ __type }) => __type);
  },
});

export default Edge;
