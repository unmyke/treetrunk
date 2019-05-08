import { interfaceType } from 'nexus';

const Timestamps = interfaceType({
  name: 'Timestamps',
  definition(t) {
    t.date('createdAt', {
      resolve: (value) => new Date(value),
    });
    t.date('updatedAt', {
      nullable: true,
      resolve: (value) => new Date(value),
    });
    t.date('deletedAt', {
      nullable: true,
      resolve: (value) => new Date(value),
    });
    t.resolveType(() => null);
  },
});

export default Timestamps;
