import { mutationField } from 'nexus';

import { Seller as getSeller } from '../../../types';
import getArgs from './args';
import resolve from './resolver';

const deleteDismiss = (ctx) => {
  const Seller = getSeller(ctx);
  const args = getArgs(ctx);
  return mutationField('deleteSellerDismiss', {
    type: Seller,
    description: "Delete seller's dismiss",
    args,
    resolve,
  });
};
export default deleteDismiss;
