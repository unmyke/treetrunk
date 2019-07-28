import { objectType } from 'nexus';

// const getTypeEdge = (ctx) => ({ name: typeName }) => {
const getTypeEdge = (ctx) => {
  const {
    interfaces: { Edge },
  } = ctx;

  return (typeName) =>
    objectType({
      name: `${typeName}Edge`,
      definition(t) {
        t.implements(Edge);
        t.field('node', {
          type: typeName,
        });
      },
    });
};
export default getTypeEdge;
