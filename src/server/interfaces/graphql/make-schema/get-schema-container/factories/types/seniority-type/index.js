import { objectType } from 'nexus';

import getAward from './award';

const SeniorityType = (ctx) => {
  const {
    interfaces: { Node, Timestamps },
    scalars: { PositiveFloat, PositiveInt },
    enums: { DeletableEntityState },
    utils: { getSchemaItem },
  } = ctx;
  const Award = getSchemaItem(getAward);

  return objectType({
    name: 'SeniorityType',
    definition(t) {
      t.implements(Node, Timestamps);
      t.string('name');
      t.field('months', { type: PositiveInt, nullable: true });
      t.field('award', { type: PositiveFloat, nullable: true });
      t.field('state', { type: DeletableEntityState });
      t.list.field('awards', { type: Award });
    },
  });
};

export default SeniorityType;
