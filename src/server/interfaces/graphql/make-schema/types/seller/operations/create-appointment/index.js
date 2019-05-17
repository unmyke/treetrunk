import { mutationField } from 'nexus';

import Seller from '../../seller';
import args from './args';
import resolve from './resolver';

const createAppointment = mutationField('createSellerAppointment', {
  type: Seller,
  description: 'Add appointment to seller',
  args,
  resolve,
});
export default createAppointment;
