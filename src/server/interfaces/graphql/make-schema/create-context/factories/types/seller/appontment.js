import { objectType } from 'nexus';

import { getPostByPostId as getPostByPostIdResolver } from './resolvers';

const SellerAppontment = (
  { types: { Post }, scalars: { Day } },
  getResolver
) => {
  const getPostByPostId = getResolver(getPostByPostIdResolver);

  return objectType({
    name: 'SellerAppontment',
    definition(t) {
      t.id('postId');
      t.field('post', {
        type: Post,
        resolve: getPostByPostId,
      });
      t.field('day', { type: Day });
    },
  });
};

export default SellerAppontment;
