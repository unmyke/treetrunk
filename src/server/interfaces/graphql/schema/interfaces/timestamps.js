import { interfaceType } from 'nexus';
import { identity } from '@common';

const Timestamps = interfaceType({
  name: 'TimestampsInterface',
  definition(t) {
    t.dateTime('createdAt');
    t.dateTime('updatedAt', { nullable: true });
    t.dateTime('deletedAt', { nullable: true });
    t.resolveType(identity);
  },
});

export default Timestamps;
