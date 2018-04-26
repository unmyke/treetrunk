export const ShopType = (factory, { ShopType }) => {
  factory.define('shopType', ShopType, {
    name: factory.chance('word'),
    state: 'active',
  });
};
