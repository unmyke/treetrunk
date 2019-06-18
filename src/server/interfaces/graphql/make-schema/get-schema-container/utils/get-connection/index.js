import { objectType } from 'nexus';

import getEdge from './get-edge';
import { Connection as getTypeConnectionInterface } from '../../interfaces';

const ConnectionInterface = getTypeConnectionInterface();

const getTypeConnection = (type) => {
  const { name } = type;

  const Edge = getEdge(type);

  const Connection = objectType({
    name: `${name}Connection`,
    definition(t) {
      t.implements(ConnectionInterface);
      t.list.field('edges', { type: Edge });
    },
  });

  return Connection;
};
export default getTypeConnection;
