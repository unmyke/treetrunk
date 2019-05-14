import { objectType } from 'nexus';

import interfaces from '../../../interfaces';
import getEdge from './get-edge';

const { Connection: ConnectionInterface } = interfaces;

const getConnection = (type) => {
  const { name } = type;

  const Edge = getEdge(type);

  const Connection = objectType({
    name: `${name}Connection`,
    definition(t) {
      t.implements(ConnectionInterface);
    },
  });

  return { Connection, Edge };
};

export default getConnection;
