import { objectType } from 'nexus';

const getTypeEdge = (ctx) => ({ name }) => {
  const {
    interfaces: { Edge },
  } = ctx;

  return objectType({
    name: `${name}Edge`,
    definition(t) {
      t.implements(Edge);
      t.field('node', {
        type: name,
      });
    },
  });
};
export default getTypeEdge;
