import { inputObjectType } from 'nexus';

const PieceRateInput = (ctx) => {
  const {
    scalars: { Percentage, DateTime },
  } = ctx;

  return inputObjectType({
    name: 'PieceRateInput',
    definition(t) {
      t.fields('value', { type: Percentage });
      t.fields('day', { type: DateTime });
    },
  });
};
export default PieceRateInput;
