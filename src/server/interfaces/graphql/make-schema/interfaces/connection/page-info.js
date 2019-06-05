import { objectType } from 'nexus';

const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.boolean('hasNextPage');
    t.boolean('hasPreviousPage');
    t.boolean('startCursor');
    t.boolean('endCursor');
  },
});

export default PageInfo;
