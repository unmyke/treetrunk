import { objectType } from 'nexus';

import getEdge from './get-edge';
import interfaces from '../../../interfaces';

const { Connection: ConnectionInterface } = interfaces;

const getConnection = (type) => {
  const { name } = type;

  const Edge = getEdge(type);

  const Connection = objectType({
    name: `${name}Connection`,
    definition(t) {
      t.implements(ConnectionInterface);
      t.list.field('edges', { type: Edge });
    },
  });

  return { Connection, Edge };
};

export default getConnection;
