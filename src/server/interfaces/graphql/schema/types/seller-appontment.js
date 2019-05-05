import { objectType } from 'nexus';

import Post from './post';

const SellerAppontment = objectType({
  name: 'SellerAppontment',
  definition(t) {
    t.field('post', {
      type: Post,
    });
    t.day('day');
  },
});

export default SellerAppontment;
