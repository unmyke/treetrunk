import { objectType } from 'nexus';

import Post from '../post';
import { Post as postResolver } from '../../resolvers';

const SellerAppontment = objectType({
  name: 'SellerAppontment',
  definition(t) {
    t.field('post', {
      type: Post,
      resolve: postResolver,
    });
    t.day('day');
  },
});

export default SellerAppontment;
