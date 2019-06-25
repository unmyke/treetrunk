import getArgs from './args';
import resolve from './resolver';

const deleteDismiss = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return {
    name: 'deleteDismiss',
    type: Seller,
    description: "Delete seller's dismiss",
    args,
    resolve,
  };
};
export default deleteDismiss;
