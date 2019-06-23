import { extendType } from 'nexus';

const getQuery = (ctx) => {
  const {
    types: { Query },
  } = ctx;

  return (name, query) =>
    extendType({
      type: Query,
      definition: (t) => {
        t.field(name, query);
      },
    });
};
export default getQuery;
