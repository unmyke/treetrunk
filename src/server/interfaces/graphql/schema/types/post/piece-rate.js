import { objectType } from 'nexus';

const PieceRate = objectType({
  name: 'PieceRate',
  description: 'Piece rate of post',
  definition(t) {
    t.float('value');
    t.day('day');
  },
});

export default PieceRate;
