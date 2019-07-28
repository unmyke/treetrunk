import { inputObjectType } from 'nexus';

const PieceRateInput = (ctx) => {
  const {
    scalars: { Percentage, DateTime },
    utils: { memoize },
  } = ctx;

  return inputObjectType({
    name: 'PieceRateInput',
    definition(t) {
      t.field('value', { type: Percentage });
      t.field('day', { type: DateTime });
    },
  });
};
export default PieceRateInput;
