import { objectType, arg, intArg } from 'nexus';

import PageInfo from './page-info';
// import { Edge } from '../interfaces';
import { Filter as FilterInput, Sort as SortInput } from '../inputs';
import { Cursor } from '../scalars';

export default (name, resolver) => {
  const Edge = objectType({
    name: `${name}Edge`,
    definition(t) {
      t.id('cursor', ({ id }) => `${name}:${id}`);
      t.field('node', { type: name });
    },
  });

  const Connection = objectType({
    name: `${name}Connection`,
    args: {
      skip: intArg({ required: false }),
      first: intArg({ required: false }),
      after: arg({ type: Cursor, required: false }),
      last: intArg({ required: false }),
      before: arg({ type: Cursor, required: false }),
      filter: FilterInput,
      sort: SortInput,
    },
    resolver,
    definition(t) {
      t.list.field('edges', { type: `${name}Edge` });
      t.field('pageInfo', { type: PageInfo });
    },
  });

  return { Connection, Edge };
};
