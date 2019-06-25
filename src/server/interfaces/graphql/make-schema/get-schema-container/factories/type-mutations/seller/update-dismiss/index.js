import getArgs from './args';
import resolve from './resolver';

const updateDismiss = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return {
    name: 'updateDismissTo',
    type: Seller,
    description: "Update seller's dismiss to new day",
    args,
    resolve,
  };
};
export default updateDismiss;
