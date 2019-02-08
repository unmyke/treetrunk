import { getRandomDay } from '../_lib';

const SellerAppointment = (factory, { SellerAppointment }) => {
  factory.define('sellerAppointment', SellerAppointment, {
    post_id: factory.assoc('post', 'post_id'),
    day: () => getRandomDay(),
  });
};

export default SellerAppointment;
