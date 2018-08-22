import { BaseMapper } from '../../_lib';
import {
  SellerId as SellerIdMapper,
  PostId as PostIdMapper,
  Day as DayMapper,
} from '../../commonTypes';

export class SellerMapper extends BaseMapper {
  constructor({ commonTypes, Entity }) {
    super({ commonTypes, Entity });
    this.sellerIdMapper = new SellerIdMapper({ commonTypes });
    this.postIdMapper = new PostIdMapper({ commonTypes });
    this.dayMapper = new DayMapper({ commonTypes });
  }

  toDatabase({ sellerId, firstName, middleName, lastName, phone }) {
    return {
      sellerId: this.sellerIdMapper.toDatabase(sellerId),
      firstName,
      middleName,
      lastName,
      phone,
      appointments: _appointments.map(({ postId, day }) => ({
        postId: this.postIdMapper.toDatabase(postId),
        day: this.dayMapper.toDatabase(day),
      })),
    };
  }

  toEntity({ sellerId, firstName, middleName, lastName, phone, appointments }) {
    const sellerEntity = this.Entity.restore({
      sellerId: this.sellerIdMapper.toEntity({ value: sellerId }),
      firstName,
      middleName,
      lastName,
      phone,
      appointments: appointments.map(({ postId, day }) => ({
        postId: this.postIdMapper.toEntity({ value: postId }),
        day: this.dayMapper.toEntity({ value: day }),
      })),
    });

    return sellerEntity;
  }
}
