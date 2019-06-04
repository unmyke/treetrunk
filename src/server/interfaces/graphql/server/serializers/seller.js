import timestamp from './timestamp';
import list from './list';
import id from './id';
import post from './post';
import day from './day';

const serializers = { id, post, day };

const Seller = timestamp((seller) => {
  const {
    sellerId,
    fullName,
    firstName,
    middleName,
    lastName,
    phone,
    seniority,
    postId,
    postIds,
    appointments,
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
    seniority,
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
});

export default Seller;
export const Sellers = list(Seller);