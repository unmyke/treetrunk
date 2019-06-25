import { extendType } from 'nexus';

const getQuery = (ctx) => {
  const {
    types: { Query },
  } = ctx;
  return ({ name, ...query }) => {
    const queryField = extendType({
      type: Query.name,
      definition: (t) => {
        t.field(name, query);
      },
    });
    return queryField;
  };
};
export default getQuery;
