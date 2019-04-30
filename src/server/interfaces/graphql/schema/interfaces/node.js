import { interfaceType } from 'nexus';

import getId from './get-id';

const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', {
      resolve: getId,
      description: 'Unique identifier for the resource',
    });
    t.resolveType(() => null);
  },
});

export default Node;
