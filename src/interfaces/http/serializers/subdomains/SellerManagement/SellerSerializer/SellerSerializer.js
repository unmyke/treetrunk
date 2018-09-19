// import { Serializer } from 'jsonapi-serializer';
import { BaseSerializer } from 'src/domain/_lib';
import {
  SellerId as sellerIdSerializer,
  PostId as postIdSerializer,
  Day as daySerializer,
} from '../../../commonTypes';

export class SellerSerializer extends BaseSerializer {
  static mapper = {
    sellerId: { propName: 'id', serialize: sellerIdSerializer.serialize },
    firstName: { propName: 'first_name' },
    middleName: { propName: 'middle_name' },
    lastName: { propName: 'last_name' },
    phone: { propName: 'phone' },
    state: { propName: 'state' },
    postId: { propName: 'post', serialize: postIdSerializer.serialize },
    recruitDay: { propName: 'recruit_day', serialize: daySerializer.serialize },
    dismissDay: { propName: 'dismiss_day', serialize: daySerializer.serialize },
    seniority: { propName: 'seniority' },
    appointments: {
      propName: 'appointments',
      serialize: [
        {
          postId: { propName: 'post', serialize: postIdSerializer.serialize },
          day: { propName: 'day', serialize: daySerializer.serialize },
        },
      ],
    },
  };

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
      postId: post,
      recruitDay: recruit_day,
      dismissDay: dismiss_day,
      seniority,
      state,
    } = seller;

    const appointments = seller.appointments.map(({ postId, day }) => ({
      post: serializePostId(postId),
      day: serializeDay(day),
    }));

    const serializedSeller = {
      id: serializeSellerId(sellerId),
      first_name,
      middle_name,
      last_name,
      phone,
      post: serializePostId(post),
      recruit_day: serializeDay(recruit_day),
      dismiss_day: serializeDay(dismiss_day),
      seniority,
      state,
      appointments,
    };

    return serializedSeller;
  }
}
