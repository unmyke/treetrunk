import { mutationField } from 'nexus';

import { Seller as getSeller } from '../../../types';
import getArgs from './args';
import resolve from './resolver';

const createAppointment = (ctx) => {
  const Seller = getSeller(ctx);
  const args = getArgs(ctx);

  return mutationField('createSellerAppointment', {
    type: Seller,
    description: 'Add appointment to seller',
    args,
    resolve,
  });
};
export default createAppointment;
