import getArgs from './args';
import resolve from './resolver';

const deleteDismiss = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem, getMutationField },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'deleteDismiss',
      type: Seller,
      description: "Delete seller's dismiss",
      args,
      resolve,
    },
    Seller
  );
};
export default deleteDismiss;
