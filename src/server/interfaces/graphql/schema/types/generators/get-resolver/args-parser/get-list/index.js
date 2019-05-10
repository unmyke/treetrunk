import types from './types';

export default (args) => {
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

  return {
    // eslint-disable-next-line no-nested-ternary
    type: last ? types.BACKWARD : types.FORWARD,
    ...(after || before ? { id: after.id ? after.id : before.id } : {}),
    ...(first || last ? { count: first ? first : last } : {}),
    ...(filter
      ? {
          ...(filter.text ? { text: filter.text } : {}),
          ...(filter.fields ? { fields: filter.fields } : {}),
        }
      : {}),
    ...(sort
      ? {
          ...(sort.field ? { field: sort.field } : {}),
          ...(sort.order ? { order: sort.order } : {}),
        }
      : {}),
  };
};
