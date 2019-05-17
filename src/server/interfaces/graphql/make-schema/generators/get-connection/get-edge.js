import { objectType } from 'nexus';
import { lowerFirst } from 'lodash/fp';

import { identity } from '@common';
import interfaces from '../../interfaces';

const { Edge: EdgeInterface } = interfaces;

const getEdge = ({ name }) =>
  objectType({
    name: `${name}Edge`,
    definition(t) {
      t.implements(EdgeInterface);
      t.cursor('cursor', {
        resolve: ({ [`${lowerFirst(name)}Id`]: id }) => ({
          typeName: name,
          id,
        }),
      });
      t.field('node', {
        type: name,
        resolve: identity,
      });
    },
  });

export default getEdge;
