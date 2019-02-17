import { getRandomDay } from '../_lib';

const SellerAppointment = (factory, { SellerAppointment }) => {
  factory.define('sellerAppointment', SellerAppointment, {
    postId: factory.assoc('post', 'postId'),
    day: () => getRandomDay(),
  });
};

export default SellerAppointment;
