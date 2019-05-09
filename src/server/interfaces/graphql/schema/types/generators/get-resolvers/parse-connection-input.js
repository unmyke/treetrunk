import separator from './cursor-separator';
import types from './input-types';

const getIdByCursor = (cursor, errors) => {
  const [, id] = cursor.split(separator);

  if (!id) throw errors.gqlInvalidInput('Invalid cursor');
};

export default (args, errors) => {
  const { first, after, last, before, skip, filter, sort } = args;

  const isContainBothAfterAndBefore = after && before;
  const isContainsBothFirstAndLast = first && last;
  const isContainsBothBeforeAndFirst = before && first;
  const isContainsBothAfterAndLast = after && last;
  const isContainsBothSkipAndCursorArgs = skip && (after || before);

  if (
    isContainBothAfterAndBefore ||
    isContainsBothFirstAndLast ||
    isContainsBothBeforeAndFirst ||
    isContainsBothAfterAndLast ||
    isContainsBothSkipAndCursorArgs
  )
    throw errors.gqlInvalidInput('Invalid pagination input');

  const isOffsetPagination = Boolean(skip);
  return {
    // eslint-disable-next-line no-nested-ternary
    type: isOffsetPagination
      ? types.OFFSET
      : first
      ? types.CURSOR_FORWARD
      : types.CURSOR_BACKWARD,
    ...(after || before ? { id: getIdByCursor(after || before, errors) } : {}),
    count: first || last,
    ...(skip ? { skip } : {}),
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
