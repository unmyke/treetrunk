import { objectType } from 'nexus';

import getPieceRate from './piece-rate';

const Post = (ctx) => {
  const {
    interfaces: { Node, Timestamps },
    enums: { DeletableEntityState },
    scalars,
  } = ctx;
  const PieceRate = getPieceRate({ scalars });

  return objectType({
    name: 'Post',
    definition(t) {
      t.implements(Node, Timestamps);
      t.string('name');
      t.positiveFloat('pieceRate', { nullable: true });
      t.field('state', { type: DeletableEntityState });
      t.list.field('pieceRates', { type: PieceRate });
    },
  });
};
export default Post;
