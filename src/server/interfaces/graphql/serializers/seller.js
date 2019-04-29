import id from './id';
import post from './post';
import seniorityType from './seniority-type';
import day from './day';

const serializers = { id, post, seniorityType, day };

const sellerSerializer = ({ seller, posts, seniorityType }) => {
  const getPostById = (postId) =>
    serializers.post(posts[serializers.id(postId)]);

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

  const serializedAppointments = appointments.map(({ postId, day }) => ({
    post: getPostById(postId),
    day: serializers.day(day),
  }));

  return {
    id: serializers.id(sellerId),
    fullName,
    firstName,
    middleName,
    lastName,
    phone,
    post: getPostById(postId),
    posts: postIds.map(getPostById),
    seniorityType: serializers.seniorityType(seniorityType),
    recruitDay: serializers.day(recruitDay),
    dismissDay: serializers.day(dismissDay),
    appointments: serializedAppointments,
    state,
  };
};

export default sellerSerializer;
