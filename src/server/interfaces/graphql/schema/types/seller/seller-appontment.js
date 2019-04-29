import { objectType } from 'nexus';

import Post from '../post';
import { Day } from '../../scalars';

const SellerAppontment = objectType({
  name: 'SellerAppontment',
  definition(t) {
    t.field('post', Post);
    t.field('day', Day);
  },
});

export default SellerAppontment;
