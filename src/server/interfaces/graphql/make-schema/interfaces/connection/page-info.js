import { objectType } from 'nexus';

const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.boolean('hasNextPage');
    t.boolean('hasPreviousPage');
    t.cursor('startCursor');
    t.cursor('endCursor');
  },
});

export default PageInfo;
