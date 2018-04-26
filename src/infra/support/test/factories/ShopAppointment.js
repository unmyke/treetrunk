export const ShopAppointment = (factory, { Appointment }) => {
  factory.define('shopAppointment', Appointment, {
    EntityClass: 'Shop',
    entityId: factory.assoc('shop', 'id'),
    EntityTypeClass: 'ShopType',
    entityTypeId: factory.assoc('shopType', 'id'),
    date: factory.chance('date'),
    state: 'active',
  });
};
