export const Seller = (factory, { Seller }) => {
  factory.define('seller', Seller, {
    sellerId: factory.chance('guid', { version: 4 }),
    lastName: factory.chance('last'),
    firstName: factory.chance('name'),
    middleName: factory.chance('name', { middle: true }),
    phone: factory.chance('phone'),
  });
};
