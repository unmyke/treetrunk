import { objectType } from 'nexus';

const getEdge = ({ name }) =>
  objectType({
    name: `${name}Edge`,
    definition(t) {
      t.cursor('cursor', ({ id }) => `${name}:${id}`);
      t.field('node', { type: name });
    },
  });

export default getEdge;
