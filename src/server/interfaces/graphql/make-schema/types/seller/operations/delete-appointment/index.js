import { mutationField } from 'nexus';

import Seller from '../../seller';
import args from './args';
import resolve from './resolver';

const deleteAppointment = mutationField('deleteSellerAppointmentAt', {
  type: Seller,
  description: "Delete seller's appointment at day",
  args,
  resolve,
});
export default deleteAppointment;
