import { mutationField } from 'nexus';

import Seller from '../../seller';
import args from './args';
import resolve from './resolver';

const dismiss = mutationField('dismissSellerAt', {
  type: Seller,
  description: 'Dismiss seller at day',
  args,
  resolve,
});
export default dismiss;
