import { interfaceType } from 'nexus';

const Timestamps = interfaceType({
  name: 'Timestamps',
  definition(t) {
    t.date('createdAt', (value) => new Date(value));
    t.date('updatedAt', (value) => new Date(value));
    t.date('deletedAt', (value) => new Date(value));
    t.resolveType(() => null);
  },
});

export default Timestamps;
