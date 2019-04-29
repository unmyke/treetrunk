import { objectType } from 'nexus';

import { Day } from '../../scalars';

const PieceRate = objectType({
  name: 'PieceRate',
  description: 'Piece rate of post',
  definition(t) {
    t.float('value');
    t.field('day', Day);
  },
});

export default PieceRate;
