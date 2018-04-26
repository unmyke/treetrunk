export const Seller = (factory, { Seller }) => {
  factory.define('seller', Seller, {
    lastName: factory.chance('last'),
    firstName: factory.chance('name'),
    middleName: factory.chance('name', { middle: true }),
    state: 'active',
  });
};
