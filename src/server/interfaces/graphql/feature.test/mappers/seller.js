import timestamp from './timestamp';
import idMapper from './id';
import dayMapper from './day';

const sellerMapper = ({
  sellerId,
  firstName,
  middleName,
  lastName,
  phone,
  postId,
  postIds,
  appointments,
  seniority,
  recuitDay,
  dismissDay,
}) => ({
  id: idMapper(sellerId),
  firstName,
  middleName,
  lastName,
  phone,
  postId,
  postIds,
  seniority,
  appointments: appointments.map(({ postId, day }) => ({
    postId: idMapper(postId),
    day: dayMapper(day),
  })),
  recuitDay: dayMapper(recuitDay),
  dismissDay: dayMapper(dismissDay),
});

export default timestamp(sellerMapper);
