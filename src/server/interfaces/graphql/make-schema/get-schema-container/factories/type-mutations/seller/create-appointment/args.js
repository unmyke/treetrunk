import { Appointment as getAppointmentInput } from '../inputs';

const createAppointmentArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const AppointmentInput = getSchemaItem(getAppointmentInput);

  return getOperationArgs('CreateSellerAppointmentInput', (t) => {
    t.id('id', { required: true });
    t.field('appointment', { type: AppointmentInput, required: true });
  });
};
export default createAppointmentArgs;