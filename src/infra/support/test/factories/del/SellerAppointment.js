export const SellerAppointment = (factory, { Appointment }) => {
  factory.define('appointment', Appointment, {
    EntityClass: 'Seller',
    entityId: factory.assoc('seller', 'sellerId'),
    day: factory.chance('date'),
  });
};
