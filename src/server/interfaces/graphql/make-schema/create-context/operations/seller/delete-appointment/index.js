import { mutationField } from 'nexus';

import { Seller as getSeller } from '../../../types';
import getArgs from './args';
import resolve from './resolver';

const deleteAppointment = (ctx) => {
  const Seller = getSeller(ctx);
  const args = getArgs(ctx);

  return mutationField('deleteSellerAppointmentAt', {
    type: Seller,
    description: "Delete seller's appointment at day",
    args,
    resolve,
  });
};
export default deleteAppointment;
