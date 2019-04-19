/* eslint-disable valid-typeof */
import { decode } from './base64';

const paginationTypes = {
  CURSOR: 'CURSOR',
  OFFSET: 'OFFSET',
};

const types = {
  STRING: 'string',
  NUMBER: 'number',
  ARRAY: Array,
};

const arrayContainsType = (arr, type) =>
  arr.reduce((prevIsType, item) => prevIsType && typeof item === type, true);

const getOption = ({
  type,
  typeOfItem,
  value,
  predicate = () => true,
  defaultValue,
}) => {
  switch (type) {
    case types.STRING:
    case types.NUMBER:
      return value && typeof value === type && predicate(value)
        ? value
        : defaultValue;

    case types.ARRAY:
      return value &&
        value instanceof type &&
        arrayContainsType(value, typeOfItem)
        ? value
        : defaultValue;

    default:
      return null;
  }
};

const normalizeOptions = ({
  search: { text: rawText, fields: rawFields } = {},
  filters: rawFilters,
  pageSize: rawPageSize,
  page: rawPage,
  after: rawAfter,
  sort: rawSort,
  order: rawOrder,
} = {}) => {
  const text = getOption({
    type: types.STRING,
    value: rawText,
    defaultValue: '',
  });
  const fields = getOption({
    type: types.ARRAY,
    typeOfItem: types.STRING,
    value: rawFields,
    defaultValue: [],
  });
  const filters = getOption({
    type: types.ARRAY,
    typeOfItem: types.STRING,
    value: rawFilters,
    defaultValue: [],
  });
  const pageSize = getOption({
    type: types.NUMBER,
    value: rawPageSize,
    predicate: (x) => x > 0,
    defaultValue: 10,
  });
  const page = getOption({
    type: types.NUMBER,
    value: rawPage,
    predicate: (x) => x >= 0,
    defaultValue: 0,
  });
  const after = getOption({
    type: types.STRING,
    value: rawAfter,
    defaultValue: null,
  });
  const sort = getOption({
    type: types.STRING,
    value: rawSort,
    defaultValue: 'createdAt',
  });
  const sortOrder = getOption({
    type: types.STRING,
    value: rawOrder,
    defaultValue: 'desc',
  });

  return {
    search: { text, fields },
    filters,
    pageSize,
    page,
    after,
    sort,
    sortOrder,
  };
};

export default (query) => {
  const {
    search: { text, fields },
    filters,
    pageSize,
    page,
    after,
    sort,
    sortOrder,
  } = normalizeOptions(query);
  if (after) {
    return {
      type: paginationTypes.CURSOR,
      options: decode(after),
    };
  }

  const order = sortOrder === 'desc' || sortOrder === -1 ? -1 : 1;
  return {
    type: paginationTypes.OFFSET,
    options: {
      pageSize,
      page,
      filters,
      search: {
        text,
        fields,
      },
      sort,
      order,
    },
  };
};

export { paginationTypes as types };
