const { states } = require('@domain');

const define = ({ Class, name, id }) => {
  Object.defineProperty(Class, name, { value: id });
};

module.exports = {
  seeds: [
    {
      name: 'dismissPostId',
      SubdomainName: 'SellerManagement',
      ModelName: 'Post',
      values: { name: 'уволен(а)', state: states.Post.ACTIVE },
      callback: define,
    },
  ],
};
