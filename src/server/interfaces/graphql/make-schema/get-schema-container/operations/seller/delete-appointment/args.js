import { Day as DayScalar } from '../../../scalars';

const deleteAppointmentArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('DeleteSellerAppointmentInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: DayScalar, required: true });
  });
};
export default deleteAppointmentArgs;
