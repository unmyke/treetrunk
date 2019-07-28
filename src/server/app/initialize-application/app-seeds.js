import { states } from '@domain';

const define = ({ Class, name, id }) => {
  Object.defineProperty(Class, name, { value: id });
};

export default [
  {
    name: 'dismissPostId',
    SubdomainName: 'SellerManagement',
    ModelName: 'Post',
    values: { name: 'уволен(а)', state: states.Post.ACTIVE },
    callback: define,
  },
];
