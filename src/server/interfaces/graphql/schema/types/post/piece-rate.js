import { objectType } from 'nexus';

const PostPieceRate = objectType({
  name: 'PostPieceRate',
  description: 'Piece rate of post',
  definition(t) {
    t.float('value');
    t.day('day');
  },
});

export default PostPieceRate;
