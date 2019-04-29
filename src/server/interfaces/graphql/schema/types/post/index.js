import { objectType } from 'nexus';

import PieceRate from './piece-rate';
import { Node, Timestamps } from '../../interfaces';
import { DeletableEntityState } from '../../enums';

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('name');
    t.float('pieceRate');
    t.field('state', DeletableEntityState);
    t.list.field('pieceRates', PieceRate);
  },
});

export default Post;
