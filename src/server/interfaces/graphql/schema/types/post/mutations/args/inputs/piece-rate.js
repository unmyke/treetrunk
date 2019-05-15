import { inputObjectType } from 'nexus';

const PieceRateInput = inputObjectType({
  name: 'PieceRateInput',
  definition(t) {
    t.positiveFloat('value');
    t.dateTime('day');
  },
});

export default PieceRateInput;
