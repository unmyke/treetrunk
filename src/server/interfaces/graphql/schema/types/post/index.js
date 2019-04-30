import { objectType } from 'nexus';

import PieceRate from './piece-rate';
import { Node, Timestamps } from '../../interfaces';
import { DeletableEntityState } from '../../enums';

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('name');
    t.float('pieceRate', { nullable: true });
    t.field('state', { type: DeletableEntityState });
    t.list.field('pieceRates', { type: PieceRate });
  },
});

export default Post;
