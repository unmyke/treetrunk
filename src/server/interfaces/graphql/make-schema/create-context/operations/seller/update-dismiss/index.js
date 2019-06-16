import { mutationField } from 'nexus';

import { Seller as getSeller } from '../../../types';
import getArgs from './args';
import resolve from './resolver';

const updateDismiss = (ctx) => {
  const Seller = getSeller(ctx);
  const args = getArgs(ctx);

  return mutationField('updateSellerDismissTo', {
    type: Seller,
    description: "Update seller's dismiss to new day",
    args,
    resolve,
  });
};
export default updateDismiss;
