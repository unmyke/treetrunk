export const SellerAppointment = (factory, { SellerAppointment }) => {
  factory.define(
    'sellerAppointment',
    SellerAppointment,
    ({ post_id, day } = {}) => ({
      post_id: post_id || factory.assoc('post', 'post_id'),
      day: day || factory.chance('date'),
    })
  );
};
