import timestamp from './timestamp';
import id from './id';
import post from './post';
import day from './day';

const serializers = { id, post, day };

const sellerSerializer = (seller) => {
  const {
    sellerId,
    fullName,
    firstName,
    middleName,
    lastName,
    postId,
    postIds,
    appointments,
    phone,
    recruitDay,
    dismissDay,
    state,
  } = seller;

  return {
    __type: 'Seller',
    id: serializers.id(sellerId),
    fullName,
    firstName,
    middleName,
    lastName,
    phone,
    postId: serializers.id(postId),
    postIds: postIds.map(serializers.id),
    recruitDay: serializers.day(recruitDay),
    dismissDay: serializers.day(dismissDay),
    appointments: appointments.map(({ postId, day }) => ({
      postId: serializers.id(postId),
      day: serializers.day(day),
    })),
    state,
  };
};

export default timestamp(sellerSerializer);
