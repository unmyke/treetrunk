export const SellerAppointment = (factory, { SellerAppointment }) => {
  factory.define('sellerAppointment', SellerAppointment, {
    sellerId: factory.assoc('seller', 'sellerId'),
    postId: factory.assoc('post', 'postId'),
    day: factory.chance('date'),
  });
};
