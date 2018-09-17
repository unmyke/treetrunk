// import { Serializer } from 'jsonapi-serializer';
import { BaseSerializer } from 'src/domain/_lib';

export class SellerSerializer extends BaseSerializer {
  serialize(seller) {
    const {
      SellerId: { serialize: serializeSellerId },
      PostId: { serialize: serializePostId },
      Day: { serialize: serializeDay },
    } = this.commonTypes;
    const {
      sellerId,
      firstName: first_name,
      middleName: middle_name,
      lastName: last_name,
      phone,
      postId,
      recruitDay,
      dismissDay,
      seniority,
      state,
    } = seller;

    const appointments = seller.appointments.map(({ postId, day }) => ({
      post: serializePostId(postId),
      day: serializeDay(day),
    }));

    return {
      id: serializeSellerId(sellerId),
      first_name,
      middle_name,
      last_name,
      phone,
      post: serializePostId(postId),
      recruit_day: serializeDay(recruitDay),
      dismiss_day: serializeDay(dismissDay),
      seniority,
      state,
      appointments,
    };
  }
}
