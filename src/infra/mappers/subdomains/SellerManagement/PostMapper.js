import { BaseMapper } from '../../_lib';
import { PostId as PostIdMapper, Day as DayMapper } from '../../commonTypes';

export class PostMapper extends BaseMapper {
  constructor({ commonTypes, Entity }) {
    super({ commonTypes, Entity });
    this.postIdMapper = new PostIdMapper({ commonTypes });
    this.dayMapper = new DayMapper({ commonTypes });
  }

  toDatabase({ postId, name, state, pieceRates }) {
    return {
      post_id: this.postIdMapper.toDatabase(postId),
      name,
      state,
      piece_rates: pieceRates.map(({ value, day }) => ({
        value,
        day: this.dayMapper.toDatabase(day),
      })),
    };
  }

  toEntity({ post_id, name, state, piece_rates }) {
    return this.Entity.restore({
      postId: this.postIdMapper.toEntity({ value: post_id }),
      name,
      state,
      pieceRates: piece_rates.map(({ value, day }) => ({
        value,
        day: this.dayMapper.toEntity({ value: day }),
      })),
    });
  }
}
