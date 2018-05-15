import { BaseMapper } from '../../_lib';
import { PostId as PostIdMapper, Day as DayMapper } from '../../commonTypes';

export class PostMapper extends BaseMapper {
  constructor({ commonTypes, Entity }) {
    super({ commonTypes, Entity });
    this.postIdMapper = new PostIdMapper({ commonTypes });
    this.dayMapper = new DayMapper({ commonTypes });
  }

  toDatabase({ postId, name, pieceRates }) {
    return {
      postId: this.postIdMapper.toDatabase(postId),
      name,
      pieceRates: pieceRates.map(({ value, day }) => ({
        value,
        date: this.dayMapper.toDatabase(day),
      })),
    };
  }

  toEntity({ postId, name, pieceRates }) {
    const postEntity = new this.Entity({
      postId: this.postIdMapper.toEntity({ value: postId }),
      name,
    });

    postEntity.setPieceRates(pieceRates);

    return postEntity;
  }
}
