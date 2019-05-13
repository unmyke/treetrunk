import { objectType } from 'nexus';

import PageInfo from '../../page-info';
import getEdge from './get-edge';

const getConnection = (type) => {
  const { name } = type;

  const Edge = getEdge(type);

  const Connection = objectType({
    name: `${name}Connection`,
    definition(t) {
      t.list.field('edges', {
        type: `${name}Edge`,
        resolve: ({ entities }) => {
          return entities;
        },
      });
      t.field('pageInfo', {
        type: PageInfo,
        resolve: ({ hasBefore, hasAfter }) => {
          return { hasPreviousPage: hasBefore, hasNextPage: hasAfter };
        },
      });
    },
  });

  return { Connection, Edge };
};

export default getConnection;
