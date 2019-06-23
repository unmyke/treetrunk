import { objectType } from 'nexus';

import getTypeEdge from './get-type-edge';

const getTypeConnection = (ctx) => {
  const {
    interfaces: { Connection },
  } = ctx;

  return (type) => {
    const { name } = type;
    const Edge = getTypeEdge(ctx);
    const TypeEdge = Edge(type);

    const TypeConnection = objectType({
      name: `${name}Connection`,
      definition(t) {
        t.implements(Connection);
        t.list.field('edges', { type: TypeEdge });
      },
    });

    return TypeConnection;
  };
};
export default getTypeConnection;
