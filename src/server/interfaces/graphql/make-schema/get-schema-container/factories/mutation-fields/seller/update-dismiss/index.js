import getArgs from './args';
import resolve from './resolver';

const updateDismiss = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem, getMutationField },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'updateDismissTo',
      type: Seller,
      description: "Update seller's dismiss to new day",
      args,
      resolve,
    },
    Seller
  );
};
export default updateDismiss;
