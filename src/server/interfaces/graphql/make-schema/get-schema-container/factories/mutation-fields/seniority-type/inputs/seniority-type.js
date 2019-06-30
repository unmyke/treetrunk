import { inputObjectType } from 'nexus';

const SeniorityTypeInput = (ctx) => {
  const {
    scalars: { PositiveInt },
  } = ctx;
  return inputObjectType({
    name: 'SeniorityTypeInput',
    definition(t) {
      t.string('name');
      t.field('months', { type: PositiveInt });
    },
  });
};

export default SeniorityTypeInput;
