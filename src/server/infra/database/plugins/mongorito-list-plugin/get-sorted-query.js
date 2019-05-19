const getSortedQuery = (query, { sort: sortField, order }) =>
  query.sort(sortField, order).sort('_id', order);

export default getSortedQuery;
