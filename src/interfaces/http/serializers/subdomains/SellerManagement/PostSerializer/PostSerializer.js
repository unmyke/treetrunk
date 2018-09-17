// import { Serializer } from 'jsonapi-serializer';
import { BaseSerializer } from 'src/domain/_lib';

export class PostSerializer extends BaseSerializer {
  serialize(post) {
    const {
      PostId: { serialize: serializePostId },
      Day: { serialize: serializeDay },
    } = this.commonTypes;
    const { postId, name, pieceRate, state } = post;

    const piece_rates = post.pieceRates.map(({ value, day }) => ({
      value,
      day: serializeDay(day),
    }));

    return {
      id: serializePostId(postId),
      name,
      piece_rate: pieceRate,
      state,
      piece_rates,
    };
  }
}
