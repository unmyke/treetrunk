import { objectType } from 'nexus';
import { lowerFirst } from 'lodash/fp';

const getEdge = ({ name }) =>
  objectType({
    name: `${name}Edge`,
    definition(t) {
      t.cursor('cursor', {
        resolve: ({ [`${lowerFirst(name)}Id`]: id }) => ({
          typeName: name,
          id,
        }),
      });
      t.field('node', { type: name, resolve: (root) => root });
    },
  });

export default getEdge;
