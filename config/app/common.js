import { states } from '@domain';

const define = ({ Class, name, id }) => {
  Object.defineProperty(Class, name, { value: id });
};

export default {
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
