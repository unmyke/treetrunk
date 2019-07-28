import { objectType } from 'nexus';
import { CRUDS } from '@common';

import { getPostByPostId as getPostByPostIdResolver } from './resolvers';

const SellerAppontment = ({
  types: { Post },
  scalars: { Day },
  utils: { getResolver },
}) => {
  const getPostByPostId = getResolver({ type: Post, crudName: CRUDS.GET });

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
