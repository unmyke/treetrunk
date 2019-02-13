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
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    state,
    flatAppointments,
  }) => {
    return {
      sellerId: sellerIdMapper.toDatabase(sellerId),
      firstName,
      middleName,
      lastName,
      phone,
      state,
      appointments: flatAppointments.map(({ postId, day }) => ({
        postId: postIdMapper.toDatabase(postId),
        day: dayMapper.toDatabase(day),
      })),
    };
  };

  const toEntity = ({
    sellerId,
    firstName,
    middleName,
    lastName,
    phone,
    state,
    appointments = [],
  }) => {
    const sellerEntity = Entity.restore({
      sellerId: sellerIdMapper.toEntity(sellerId),
      firstName,
      middleName,
      lastName,
      phone,
      state,
      // eslint-disable-next-line camelcase
      appointments: appointments.map(({ postId, day }) => ({
        postId: postIdMapper.toEntity(postId),
        day: dayMapper.toEntity(day),
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
