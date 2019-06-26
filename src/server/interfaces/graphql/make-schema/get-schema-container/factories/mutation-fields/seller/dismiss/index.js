import getArgs from './args';
import resolve from './resolver';

const dismiss = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem, getMutationField },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return getMutationField(
    {
      name: 'dismissAt',
      type: Seller,
      description: 'Dismiss seller at day',
      args,
      resolve,
    },
    Seller
  );
};
export default dismiss;
