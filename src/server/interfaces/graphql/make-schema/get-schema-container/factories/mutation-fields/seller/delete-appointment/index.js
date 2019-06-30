import getArgs from './args';
import resolve from './resolver';

const deleteAppointment = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem, getMutationField },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'deleteAppointmentAt',
      type: Seller,
      description: "Delete seller's appointment at day",
      args,
      resolve,
    },
    Seller
  );
};
export default deleteAppointment;
