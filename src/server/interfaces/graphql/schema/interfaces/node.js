import { interfaceType } from 'nexus';

import getId from './get-id';

const NodeInterface = interfaceType({
  name: 'NodeInterface',
  definition(t) {
    t.id('id', {
      description: 'Unique identifier for the resource',
    });
    t.resolveType(getId);
  },
});

export default NodeInterface;
