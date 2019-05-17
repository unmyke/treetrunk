import { objectType } from 'nexus';

import PieceRate from './piece-rate';
import interfaces from '../../interfaces';
import enums from '../../enums';

const { Node, Timestamps } = interfaces;
const { DeletableEntityState } = enums;

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.implements(Node, Timestamps);
    t.string('name');
    t.positiveFloat('pieceRate', { nullable: true });
    t.field('state', { type: DeletableEntityState });
    t.list.field('pieceRates', { type: PieceRate });
  },
});

export default Post;
