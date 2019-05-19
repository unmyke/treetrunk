import { mutationField } from 'nexus';

import Seller from '../../seller';
import args from './args';
import resolve from './resolver';

const deleteDismiss = mutationField('deleteSellerDismiss', {
  type: Seller,
  description: "Delete seller's dismiss",
  args,
  resolve,
});
export default deleteDismiss;
