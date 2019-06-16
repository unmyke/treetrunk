import { objectType } from 'nexus';

import { Node as getNode, Timestamps as getTimestamps } from '../../interfaces';
import { DeletableEntityState as getDeletableEntityState } from '../../enums';
import getAward from './award';

const SeniorityType = (ctx) => {
  const Node = getNode(ctx);
  const Timestamps = getTimestamps(ctx);
  const DeletableEntityState = getDeletableEntityState(ctx);
  const Award = getAward(ctx);

  return objectType({
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
};

export default SeniorityType;
