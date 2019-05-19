import { objectType } from 'nexus';
import interfaces from '../../interfaces';

const { Edge: EdgeInterface } = interfaces;

const getEdge = ({ name }) =>
  objectType({
    name: `${name}Edge`,
    definition(t) {
      t.implements(EdgeInterface);
      t.field('node', {
        type: name,
      });
    },
  });

export default getEdge;
