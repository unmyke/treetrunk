import { objectType } from 'nexus';

import getTypeEdgeFactory from './get-type-edge';

const getTypeConnection = (ctx) => {
  const {
    interfaces: { Connection },
  } = ctx;
  const connections = new Map();
  const getTypeEdge = getTypeEdgeFactory(ctx);

  // return (type) => {
  return (typeName) => {
    // const { typeName } = type;
    if (connections.has(typeName)) return connections.get(typeName);

    const TypeEdge = getTypeEdge(typeName);

    const TypeConnection = objectType({
      name: `${typeName}Connection`,
      definition(t) {
        t.implements(Connection);
        t.list.field('edges', { type: TypeEdge });
      },
    });
    connections.set(typeName, TypeConnection);

    return TypeConnection;
  };
};
export default getTypeConnection;
