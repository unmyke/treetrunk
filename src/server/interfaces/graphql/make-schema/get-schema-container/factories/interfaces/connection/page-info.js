import { objectType } from 'nexus';

const PageInfo = (ctx) => {
  const {
    scalars: { Cursor },
  } = ctx;

  return objectType({
    name: 'PageInfo',
    definition(t) {
      t.boolean('hasNextPage');
      t.boolean('hasPreviousPage');
      t.field('startCursor', { type: Cursor });
      t.field('endCursor', { type: Cursor });
    },
  });
};
export default PageInfo;
