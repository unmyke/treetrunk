import {
  Seller as getSellerInput,
  Appointment as getAppointmentInput,
} from '../inputs';

const createArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;
  const SellerInput = getSellerInput(ctx);
  const AppointmentInput = getAppointmentInput(ctx);

  return getOperationArgs('CreateSellerInput', (t) => {
    t.field('seller', { type: SellerInput, required: true });
    t.field('appointment', { type: AppointmentInput, required: false });
  });
};
export default createArgs;
