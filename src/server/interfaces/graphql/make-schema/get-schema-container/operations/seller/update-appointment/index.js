import { mutationField } from 'nexus';

import { Seller as getSeller } from '../../../types';
import getArgs from './args';
import resolve from './resolver';

const updateAppointment = (ctx) => {
  const Seller = getSeller(ctx);
  const args = getArgs(ctx);

  return mutationField('updateSellerAppointmentTo', {
    type: Seller,
    description: "Update seller's appointment at day to new postId and day",
    args,
    resolve,
  });
};
export default updateAppointment;
