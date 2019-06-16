import { interfaceType } from 'nexus';

const Edge = ({ interfaces: { Node } }) => {
  return interfaceType({
    name: 'EdgeInterface',
    definition(t) {
      t.cursor('cursor');
      t.field('node', {
        type: Node,
      });
      t.resolveType(({ __type }) => __type);
    },
  });
};
export default Edge;
