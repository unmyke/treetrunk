import { inputObjectType } from 'nexus';

const PieceRateInput = ({ Percentage, DateTime }) =>
  inputObjectType({
    name: 'PieceRateInput',
    definition(t) {
      t.fields('value', { type: Percentage });
      t.fields('day', { type: DateTime });
    },
  });
export default PieceRateInput;
