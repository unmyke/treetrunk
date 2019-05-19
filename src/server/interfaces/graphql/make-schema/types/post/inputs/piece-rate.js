import { inputObjectType } from 'nexus';

const PieceRateInput = inputObjectType({
  name: 'PieceRateInput',
  definition(t) {
    t.percentage('value');
    t.dateTime('day');
  },
});

export default PieceRateInput;
