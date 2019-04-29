import { queryField, stringArg } from 'nexus';

import { Seller } from '../types';
import { sellerResolver } from '../resolvers';

const sellersQueryField = queryField('seller', {
  type: Seller,
  args: { id: stringArg({ required: true }) },
  resolve: sellerResolver,
});

export default sellersQueryField;
