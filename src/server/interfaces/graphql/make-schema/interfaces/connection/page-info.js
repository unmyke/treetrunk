import { objectType } from 'nexus';

const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.boolean('hasNextPage');
    t.boolean('hasPreviousPage');
    t.cursor('startCursor', { nullable: true });
    t.cursor('endCursor', { nullable: true });
  },
});

export default PageInfo;
