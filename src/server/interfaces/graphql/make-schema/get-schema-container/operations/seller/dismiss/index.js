import { mutationField } from 'nexus';

import { Seller as getSeller } from '../../../types';
import getArgs from './args';
import resolve from './resolver';

const dismiss = (ctx) => {
  const Seller = getSeller(ctx);
  const args = getArgs(ctx);

  return mutationField('dismissSellerAt', {
    type: Seller,
    description: 'Dismiss seller at day',
    args,
    resolve,
  });
};
export default dismiss;
