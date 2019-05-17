import { arg } from 'nexus';

import {
  Seller as SellerInput,
  Appointment as AppointmentInput,
} from '../inputs';

const createArgs = {
  seller: arg({ type: SellerInput, required: true }),
  appointment: arg({ type: AppointmentInput, required: false }),
};
export default createArgs;
