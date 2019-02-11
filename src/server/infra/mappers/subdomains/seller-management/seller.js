/* eslint-disable no-underscore-dangle */
import {
  SellerId as SellerIdMapper,
  PostId as PostIdMapper,
  Day as DayMapper,
} from '../../common-types';

const SellerMapper = ({ commonTypes, Entity }) => {
  const sellerIdMapper = SellerIdMapper({ commonTypes });
  const postIdMapper = PostIdMapper({ commonTypes });
  const dayMapper = DayMapper({ commonTypes });

  const toDatabase = ({
    _id: sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    state,
    flatAppointments,
  }) => {
    const _id = sellerIdMapper.toDatabase(sellerId);

    return {
      _id,
      firstName,
      middleName,
      lastName,
      phone,
      state,
      appointments: flatAppointments.map(({ postId, day }) => ({
        post_id: postIdMapper.toDatabase(postId),
        day: dayMapper.toDatabase(day),
      })),
    };
  };

  const toEntity = ({
    _id,
    firstName,
    middleName,
    lastName,
    phone,
    state,
    appointments = [],
  }) => {
    const sellerEntity = Entity.restore({
      sellerId: sellerIdMapper.toEntity({ value: _id }),
      firstName,
      middleName,
      lastName,
      phone,
      state,
      // eslint-disable-next-line camelcase
      appointments: appointments.map(({ post_id, day }) => ({
        postId: postIdMapper.toEntity({ value: post_id }),
        day: dayMapper.toEntity({ value: day }),
      })),
    });

    return sellerEntity;
  };

  return Object.freeze({
    toEntity,
    toDatabase,
  });
};

export default SellerMapper;
