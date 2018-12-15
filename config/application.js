function define(Class, id) {
  Object.defineProperty(Class, this.name, { value: id });
}

module.exports = {
  seeds: [
    {
      name: 'dismissPostId',
      SubdomainName: 'SellerManagement',
      ModelName: 'Post',
      values: { name: 'уволен(а)', state: 'ACTIVE' },
      callback: define,
    },
  ],
};
