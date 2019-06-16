import { objectType } from 'nexus';

const PageInfo = ({ scalars: { Cursor } }) =>
  objectType({
    name: 'PageInfo',
    definition(t) {
      t.boolean('hasNextPage');
      t.boolean('hasPreviousPage');
      t.field('startCursor', { type: Cursor });
      t.field('endCursor', { type: Cursor });
    },
  });
export default PageInfo;
