import getArgs from './args';
import resolve from './resolver';

const dismiss = (ctx) => {
  const {
    types: { Seller },
    utils: { getSchemaItem },
  } = ctx;

  const args = getSchemaItem(getArgs);

  return {
    name: 'dismissAt',
    type: Seller,
    description: 'Dismiss seller at day',
    args,
    resolve,
  };
};
export default dismiss;
