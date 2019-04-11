import { decode } from './base64';

export const types = {
  CURSOR: 'CURSOR',
  OFFSET: 'OFFSET',
};

export default (
  {
    search = {
      text: '',
      fields: [],
    },
    filters = [],
    pageSize = 10,
    page = 0,
    after = null,
    sort = 'createdAt',
    order: sortOrder = 'desc',
  } = {
    search: {
      text: '',
      fields: [],
    },
    filters: [],
    pageSize: 10,
    page: 0,
    after: null,
    sort: 'createdAt',
    order: 'desc',
  }
) => {
  if (after) {
    return {
      type: types.CURSOR,
      options: decode(after),
    };
  }

  const order = sortOrder === 'desc' || sortOrder === -1 ? -1 : 1;
  return {
    type: types.OFFSET,
    options: { pageSize, page, filters, search, sort, order },
  };
};
