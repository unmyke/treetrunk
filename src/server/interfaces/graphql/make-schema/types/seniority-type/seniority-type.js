import { objectType } from 'nexus';

import Award from './award';
import interfaces from '../../interfaces';
import enums from '../../enums';

const { Node, Timestamps } = interfaces;
const { DeletableEntityState } = enums;

const SeniorityType = objectType({
  name: 'SeniorityType',
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('name');
    t.int('months', { nullable: true });
    t.float('award', { nullable: true });
    t.field('state', { type: DeletableEntityState });
    t.list.field('awards', { type: Award });
  },
});

export default SeniorityType;
