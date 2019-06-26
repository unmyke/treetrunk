import { inputObjectType } from 'nexus';

const AwardInput = (ctx) => {
  const {
    scalars: { PositiveFloat, DateTime },
  } = ctx;
  return inputObjectType({
    name: 'AwardInput',
    definition(t) {
      t.field('value', { type: PositiveFloat });
      t.field('day', { type: DateTime });
    },
  });
};

export default AwardInput;
