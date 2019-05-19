import { mutationField } from 'nexus';

import Seller from '../../seller';
import args from './args';
import resolve from './resolver';

const updateDismiss = mutationField('updateSellerDismissTo', {
  type: Seller,
  description: "Update seller's dismiss to new day",
  args,
  resolve,
});
export default updateDismiss;
