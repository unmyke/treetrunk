import { objectType } from 'nexus';

import Post from '../post';
import { Day } from '../../scalars';
import { Post as postResolver } from '../../resolvers';

const SellerAppontment = objectType({
  name: 'SellerAppontment',
  definition(t) {
    t.field('post', {
      type: Post,
      resolve: postResolver,
    });
    t.field('day', Day);
  },
});

export default SellerAppontment;
