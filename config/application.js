function define(Class, id) {
  Object.defineProperty(Class, this.name, { value: id });
}

module.exports = {
  seeds: [
    {
      name: 'dismissPostId',
      ModelName: 'Post',
      values: { name: 'уволен(а)' },
      callback: define,
    },
  ],
};
