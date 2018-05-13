import { BaseMapper } from '../_lib';
import { PostId as PostIdMapper, Day as DayMapper } from '../commonTypes';

export class PostMapper extends BaseMapper {
  constructor({ domain: { entities, commonTypes } }) {
    super({ domain: { entities, commonTypes } });
    this.postIdMapper = new PostIdMapper({ domain: { entities, commonTypes } });
    this.dayMapper = new DayMapper({ domain: { entities, commonTypes } });
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
    const postEntity = new this.entities.Post({
      postId: this.postIdMapper.toEntity({ value: postId }),
      name,
    });

    postEntity.setPieceRates(pieceRates);

    return postEntity;
  }
}
