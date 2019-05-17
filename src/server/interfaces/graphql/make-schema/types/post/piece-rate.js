import { objectType } from 'nexus';

const PostPieceRate = objectType({
  name: 'PostPieceRate',
  description: 'Piece rate of post',
  definition(t) {
    t.positiveFloat('value');
    t.day('day');
  },
});

export default PostPieceRate;
