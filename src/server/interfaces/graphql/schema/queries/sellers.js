import { queryField, idArg } from 'nexus';

import { SellerConnection } from '../connections';
import { getSellers } from '../resolvers';

const sellerQueryField = queryField('seller', {
  type: SellerConnection,
  args: { id: idArg({ required: true }) },
  resolve: getSellers,
});

export default sellerQueryField;
