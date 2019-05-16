import { inputObjectType } from 'nexus';

const SeniorityTypeInput = inputObjectType({
  name: 'SeniorityTypeInput',
  definition(t) {
    t.string('name');
    t.string('months');
  },
});

export default SeniorityTypeInput;
