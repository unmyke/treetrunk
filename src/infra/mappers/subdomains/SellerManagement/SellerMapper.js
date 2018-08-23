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

  toDatabase({
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    flatAppointments,
  }) {
    return {
      seller_id: this.sellerIdMapper.toDatabase(sellerId),
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      phone,
      appointments: flatAppointments.map(({ postId, day }) => ({
        post_id: this.postIdMapper.toDatabase(postId),
        day: this.dayMapper.toDatabase(day),
      })),
    };
  }

  toEntity({
    seller_id,
    first_name,
    middle_name,
    last_name,
    phone,
    appointments = [],
  }) {
    const sellerEntity = this.Entity.restore({
      sellerId: this.sellerIdMapper.toEntity({ value: seller_id }),
      firstName: first_name,
      middleName: middle_name,
      lastName: last_name,
      phone,
      appointments: appointments.map(({ post_id, day }) => ({
        postId: this.postIdMapper.toEntity({ value: post_id }),
        day: this.dayMapper.toEntity({ value: day }),
      })),
    });

    return sellerEntity;
  }
}
