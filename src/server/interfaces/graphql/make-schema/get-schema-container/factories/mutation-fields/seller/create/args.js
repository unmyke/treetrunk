import {
  Seller as getSellerInput,
  Appointment as getAppointmentInput,
} from '../inputs';

const createSellerArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const SellerInput = getSchemaItem(getSellerInput);
  const AppointmentInput = getSchemaItem(getAppointmentInput);

  return getOperationArgs('CreateSellerInput', (t) => {
    t.field('seller', { type: SellerInput, required: true });
    t.field('appointment', { type: AppointmentInput, required: false });
  });
};
export default createSellerArgs;
