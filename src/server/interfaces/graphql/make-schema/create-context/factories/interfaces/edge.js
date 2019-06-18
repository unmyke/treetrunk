import { interfaceType } from 'nexus';

const Edge = ({ scalars: { Cursor }, interfaces: { Node } }) => {
  return interfaceType({
    name: 'EdgeInterface',
    definition(t) {
      t.field('cursor', { type: Cursor });
      t.field('node', { type: Node });
      t.resolveType(({ __type }) => __type);
    },
  });
};
export default Edge;
