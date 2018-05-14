import { SellerManagementMapper } from './SellerManagementMapper';
import { PostId as PostIdMapper, Day as DayMapper } from '../../commonTypes';

export class PostMapper extends SellerManagementMapper {
  constructor({ commonTypes, subdomains }) {
    super({ commonTypes, subdomains });
    this.postIdMapper = new PostIdMapper({ subdomains, commonTypes });
    this.dayMapper = new DayMapper({ subdomains, commonTypes });
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
