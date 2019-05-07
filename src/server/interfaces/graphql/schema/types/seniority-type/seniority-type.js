import { objectType } from 'nexus';

import Award from './award';
import { Node, Timestamps } from '../../interfaces';
import { DeletableEntityState } from '../../enums';

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
