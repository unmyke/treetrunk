import { objectType } from 'nexus';

const SeniorityTypeAward = ({ PositiveFloat, Day }) =>
  objectType({
    name: 'SeniorityTypeAward',
    description: 'SeniorityTypeAward for seniority',
    definition(t) {
      t.field('value', { type: PositiveFloat });
      t.field('day', { type: Day });
    },
  });

export default SeniorityTypeAward;
