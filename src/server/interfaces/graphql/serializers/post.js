import id from './id';
import day from './day';

const serializers = { id, day };

const postSerializer = ({ post, posts, seniorityType }) => {
  const getPostById = (postId) =>
    serializers.post(posts[serializers.id(postId)]);

  const {
    postId,
    name,
    pieceRate,
    pieceRates,
    recruitDay,
    dismissDay,
    state,
  } = post;

  const serializedAppointments = pieceRates.map(({ postId, day }) => ({
    post: getPostById(postId),
    day: serializers.day(day),
  }));

  return {
    id: serializers.id(postId),
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
    pieceRates: serializedAppointments,
    state,
  };
};

export default postSerializer;
