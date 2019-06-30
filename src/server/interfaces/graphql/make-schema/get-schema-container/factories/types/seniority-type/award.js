import { objectType } from 'nexus';

const SeniorityTypeAward = (ctx) => {
  const {
    scalars: { PositiveFloat, Day },
  } = ctx;

  return objectType({
    name: 'SeniorityTypeAward',
    description: 'SeniorityTypeAward for seniority',
    definition(t) {
      t.field('value', { type: PositiveFloat });
      t.field('day', { type: Day });
    },
  });
};
export default SeniorityTypeAward;
