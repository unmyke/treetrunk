import { objectType } from 'nexus';

const PostPieceRate = ({ scalars: { PositiveFloat, Day } }) =>
  objectType({
    name: 'PostPieceRate',
    description: 'Piece rate of the post',
    definition(t) {
      t.field('value', { type: PositiveFloat });
      t.field('day', { type: Day });
    },
  });

export default PostPieceRate;
