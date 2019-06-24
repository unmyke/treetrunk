import { objectType } from 'nexus';

import getTypeEdge from './get-type-edge';

const getTypeConnection = (ctx) => {
  const {
    interfaces: { Connection },
  } = ctx;
  const connections = new Map();

  return (type) => {
    const { name } = type;
    if (connections.has(name)) return connections.get(name);

    const Edge = getTypeEdge(ctx);
    const TypeEdge = Edge(type);

    const TypeConnection = objectType({
      name: `${name}Connection`,
      definition(t) {
        t.implements(Connection);
        t.list.field('edges', { type: TypeEdge });
      },
    });
    connections.set(name, TypeConnection);

    return TypeConnection;
  };
};
export default getTypeConnection;
