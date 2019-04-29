import { interfaceType } from 'nexus';

const Timestamps = interfaceType({
  name: 'Timestamps',
  definition(t) {
    t.date('createdAt', () => new Date());
    t.date('updatedAt', () => new Date());
    t.resolveType(() => null);
  },
});

export default Timestamps;
