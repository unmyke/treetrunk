import { mutationField } from 'nexus';

import Seller from '../../seller';
import args from './args';
import resolve from './resolver';

const updateAppointment = mutationField('updateSellerAppointmentTo', {
  type: Seller,
  description: "Update seller's appointment at day to new postId and day",
  args,
  resolve,
});
export default updateAppointment;
