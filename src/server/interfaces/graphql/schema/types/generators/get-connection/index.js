import { objectType } from 'nexus';

import getEdge from './get-edge';
import PageInfo from '../../page-info';

const getConnection = (type) => {
  const { name } = type;

  const Edge = getEdge(type);

  const Connection = objectType({
    name: `${name}Connection`,
    definition(t) {
      t.list.field('edges', { type: Edge });
      t.field('pageInfo', { type: PageInfo });
    },
  });

  return { Connection, Edge };
};

export default getConnection;
