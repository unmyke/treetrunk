import { interfaceType } from 'nexus';

import { getIdPropNameByEntity } from '../common-resolvers';

const NodeInterface = interfaceType({
  name: 'NodeInterface',
  definition(t) {
    t.id('id', {
      description: 'Unique identifier for the resource',
      resolve: getIdPropNameByEntity,
    });
    t.resolveType(() => null);
  },
});

export default NodeInterface;
