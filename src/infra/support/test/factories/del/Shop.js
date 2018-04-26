export const Shop = (factory, { Shop }) => {
  factory.define('shop', Shop, {
    name: factory.chance('word'),
    address: factory.chance('address'),
    phone: factory.chance('phone'),
    state: 'active',
  });
};
