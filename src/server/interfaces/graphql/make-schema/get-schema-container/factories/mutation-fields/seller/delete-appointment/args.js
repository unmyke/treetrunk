const deleteAppointmentArgs = (ctx) => {
  const {
    scalars: { Day },
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('DeleteSellerAppointmentInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: Day, required: true });
  });
};
export default deleteAppointmentArgs;
