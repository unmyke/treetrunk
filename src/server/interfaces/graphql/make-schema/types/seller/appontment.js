import { objectType } from 'nexus';

import Post from '../post';
import { getPostByPostId } from './resolvers';

const SellerAppontment = objectType({
  name: 'SellerAppontment',
  definition(t) {
    t.field('post', {
      type: Post,
      resolve: getPostByPostId,
    });
    t.day('day');
  },
});

export default SellerAppontment;
