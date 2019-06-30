import { objectType } from 'nexus';

const PostPieceRate = (ctx) => {
  const {
    scalars: { PositiveFloat, Day },
  } = ctx;

  return objectType({
    name: 'PostPieceRate',
    description: 'Piece rate of the post',
    definition(t) {
      t.field('value', { type: PositiveFloat });
      t.field('day', { type: Day });
    },
  });
};
export default PostPieceRate;
