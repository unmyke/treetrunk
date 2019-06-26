import getArgs from './args';
import resolve from './resolver';

const createAppointment = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem, getMutationField },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'createAppointment',
      type: Seller,
      description: 'Add appointment to seller',
      args,
      resolve,
    },
    Seller
  );
};
export default createAppointment;
