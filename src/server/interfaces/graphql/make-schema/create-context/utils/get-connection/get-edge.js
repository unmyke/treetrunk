import { objectType } from 'nexus';
import { Edge as getEdgeInterface } from '../../interfaces';

const Edge = getEdgeInterface();

const getEdge = ({ name }) => {
  return objectType({
    name: `${name}Edge`,
    definition(t) {
      t.implements(Edge);
      t.field('node', {
        type: name,
      });
    },
  });
};
export default getEdge;
