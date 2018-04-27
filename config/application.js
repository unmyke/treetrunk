function define(Class, id) {
  Class.defineProperty(Class, this.name, { value: id });
}

module.exports = {
  seeds: [
    {
      name: 'quitPostId',
      ModelName: 'Post',
      values: { name: 'уволен(а)' },
      callback: define,
    },
    {
      name: 'superSellerId',
      ModelName: 'Seller',
      values: { firstName: 'Super Seller' },
      callback: define,
    },
  ],
};
