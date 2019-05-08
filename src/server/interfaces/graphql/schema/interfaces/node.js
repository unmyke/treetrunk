import { interfaceType } from 'nexus';

import getId from './get-id';

const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', {
      description: 'Unique identifier for the resource',
    });
    t.resolveType(getId);
  },
});

export default Node;
