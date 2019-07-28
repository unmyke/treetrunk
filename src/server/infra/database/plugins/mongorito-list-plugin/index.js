import { PAGINATION_TYPES } from '@common';

import { makeAddStaticMethodPlugin } from '../../_lib';

import getSortOrder from './get-sort-order';
import getSortedQuery from './get-sorted-query';
import getFilteredQuery from './get-filtered-query';
import getResultAfterId from './get-result-after-id';

const getList = (Model) => async (
  {
    type = PAGINATION_TYPES.FORWARD,
    id: prevId,
    count = 10,
    filter,
    sort: { field: sort = 'createdAt', order: rawOrder = 'desc' } = {
      field: 'createdAt',
      order: 'desc',
    },
    where,
  } = {
    type: PAGINATION_TYPES.FORWARD,
    count: 10,
    sort: { field: 'createdAt', order: 'desc' },
  }
) => {
  const filteredQuery = getFilteredQuery(Model, filter, where);
  const order = getSortOrder(type, rawOrder);
  const sortedQuery = getSortedQuery(filteredQuery, { sort, order });

  return getResultAfterId({
    type,
    Model,
    query: sortedQuery,
    prevId,
    sort,
    order,
    count,
  });
};

export default makeAddStaticMethodPlugin(getList);
