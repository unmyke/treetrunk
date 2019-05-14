import { objectType } from 'nexus';
import { lowerFirst } from 'lodash/fp';
import interfaces from '../../../interfaces';

const { Edge: EdgeInterface } = interfaces;

const getEdge = ({ name }) =>
  objectType({
    name: `${name}Edge`,
    definition(t) {
      t.implements(EdgeInterface);
      t.cursor('cursor', {
        resolve: ({ [`${lowerFirst(name)}Id`]: id }) => ({
          id,
          typeName: name,
        }),
      });
      t.field('node', { type: name });
    },
  });

export default getEdge;
