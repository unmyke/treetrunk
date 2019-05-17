import { arg, idArg } from 'nexus';

import { Seller as SellerInput } from '../inputs';

const updateArgs = {
  id: idArg({ required: true }),
  seller: arg({ type: SellerInput, required: true }),
};
export default updateArgs;
