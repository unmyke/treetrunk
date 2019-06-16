import { objectType } from 'nexus';

const SeniorityTypeAward = () =>
  objectType({
    name: 'SeniorityTypeAward',
    description: 'SeniorityTypeAward for seniority',
    definition(t) {
      t.float('value');
      t.day('day');
    },
  });

export default SeniorityTypeAward;
