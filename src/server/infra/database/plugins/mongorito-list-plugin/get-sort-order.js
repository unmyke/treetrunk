import { PAGINATION_TYPES } from '@common';

const getSortOrder = (type, rawOrder) => {
  const orderValue = rawOrder === 'asc' ? 1 : -1;
  const order = type === PAGINATION_TYPES.FORWARD ? orderValue : -orderValue;

  return order;
};
export default getSortOrder;
