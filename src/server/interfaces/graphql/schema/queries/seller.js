import { queryField, idArg } from 'nexus';

import { Seller } from '../types';
import { Seller as sellerResolver } from '../resolvers';

const sellerQueryField = queryField('seller', {
  type: Seller,
  args: { id: idArg({ required: true }) },
  resolve: sellerResolver,
});

export default sellerQueryField;
