import { interfaceType } from 'nexus';
import { identity } from '@common';

const Timestamps = ({ scalars: { DateTime } }) =>
  interfaceType({
    name: 'TimestampsInterface',
    definition(t) {
      t.field('createdAt', { type: DateTime });
      t.field('updatedAt', { type: DateTime, nullable: true });
      t.field('deletedAt', { type: DateTime, nullable: true });
      t.resolveType(identity);
    },
  });
export default Timestamps;
