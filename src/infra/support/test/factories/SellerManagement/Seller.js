export const Seller = (factory, { Seller }) => {
  factory.define(
    'seller',
    Seller,
    ({ sellerId, lastName, firstName, middleName, phone } = {}) => ({
      seller_id: sellerId || factory.chance('guid', { version: 4 }),
      last_name: lastName || factory.chance('last'),
      first_name: firstName || factory.chance('name'),
      middle_name: middleName || factory.chance('name', { middle: true }),
      phone: phone || factory.chance('phone'),
    }),
    {
      afterCreate: function(seller, attrs, { appointmentsCount } = {}) {
        factory.createMany('sellerAppointment', appointmentsCount || 3, {
          seller_id: seller.seller_id,
        });

        return seller;
      },
    }
  );
};
