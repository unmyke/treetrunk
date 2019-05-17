import { PAGINATION_TYPES } from '@common';

export default (args = {}, errors) => {
  const { first, after, last, before, filter, sort } = args;

  const isContainBothAfterAndBefore = after && before;
  const isContainsBothFirstAndLast = first && last;
  const isContainsBothBeforeAndFirst = before && first;
  const isContainsBothAfterAndLast = after && last;

  if (
    isContainBothAfterAndBefore ||
    isContainsBothFirstAndLast ||
    isContainsBothBeforeAndFirst ||
    isContainsBothAfterAndLast
  )
    throw errors.gqlInvalidInput('Invalid pagination input');

  const getListArgs = {
    // eslint-disable-next-line no-nested-ternary
    ...(last || first
      ? {
          type: last ? PAGINATION_TYPES.BACKWARD : PAGINATION_TYPES.FORWARD,
          count: first || last,
        }
      : {}),
    ...(after || before ? { id: after ? after.id : before.id } : {}),
    ...(filter
      ? {
          filter: {
            ...(filter.text ? { text: filter.text } : {}),
            ...(filter.fields ? { fields: filter.fields } : {}),
          },
        }
      : {}),
    ...(sort
      ? {
          sort: {
            ...(sort.field ? { field: sort.field } : {}),
            ...(sort.order ? { order: sort.order } : {}),
          },
        }
      : {}),
  };

  return [getListArgs];
};
