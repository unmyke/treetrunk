import { interfaceType } from 'nexus';

const NodeInterface = () =>
  interfaceType({
    name: 'NodeInterface',
    definition(t) {
      t.id('id', {
        description: 'Unique identifier for the resource',
      });
      t.resolveType(({ __type }) => __type);
    },
  });
export default NodeInterface;
