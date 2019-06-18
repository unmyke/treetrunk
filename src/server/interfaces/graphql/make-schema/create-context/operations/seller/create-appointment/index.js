import { mutationField } from 'nexus';

import getArgs from './args';
import resolve from './resolver';

const createAppointment = (ctx) => {
  const {
    types: { Seller },
  } = ctx;
  const args = getArgs(ctx);

  return mutationField('createSellerAppointment', {
    type: Seller,
    description: 'Add appointment to seller',
    args,
    resolve,
  });
};
export default createAppointment;
