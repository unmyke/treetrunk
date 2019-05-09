import { objectType } from 'nexus';

import PageInfo from '../../page-info';
import getEdge from './get-edge';

export default (type) => {
  const { name } = type;

  const Edge = getEdge(type);

  const Connection = objectType({
    name: `${name}Connection`,
    definition(t) {
      t.list.field('edges', { type: `${name}Edge` });
      t.field('pageInfo', { type: PageInfo });
    },
  });

  return { Connection, Edge };
};
