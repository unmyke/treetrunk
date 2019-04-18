import { encode } from './base64';

const getIdPropName = (Model) => `${Model.name.toLowerCase()}Id`;

const getQuery = ({ query, search, filters }) => {
  const searchedQuery =
    search && search.fields && search.fields.length
      ? query.or(
          search.fields.map((field) => ({
            [field]: new RegExp(search.text, 'i'),
          }))
        )
      : query;

  return filters && filters.length
    ? filters.reduce(
        (filteredQuery, { field, values }) =>
          filteredQuery.where({ [field]: values }),
        searchedQuery
      )
    : searchedQuery;
};

const getPagination = ({
  Model,
  resultPlusOne,
  pageSize,
  filters,
  search,
  sort,
  order,
}) => {
  const hasMore = resultPlusOne.length > pageSize;
  const result = hasMore ? resultPlusOne.slice(0, -1) : resultPlusOne;
  const id = result[result.length - 1].get(getIdPropName(Model));
  const cursor = encode({
    ...(id ? { id } : {}),
    pageSize,
    filters,
    search,
    sort,
    order,
  });

  return {
    result,
    hasMore,
    cursor,
  };
};

export const getCursorPagination = async (
  Model,
  {
    id: prevId,
    page = 0,
    pageSize = 10,
    filters = [],
    search = {},
    sort = 'createdAt',
    order = 'desc',
  } = {
    page: 0,
    pageSize: 10,
    filters: [],
    search: {},
    sort: 'createdAt',
    order: -1,
  }
) => {
  const cursorModel = await Model.findOne({ [getIdPropName(Model)]: prevId });
  const {
    [sort]: cursorModelSortValue,
    _id: cursorModelIdValue,
  } = cursorModel.get();

  const resultPlusOne = await getQuery({ query: Model, search, filters })
    .or([
      { [sort]: { [order === 1 ? '$gt' : '$lt']: cursorModelSortValue } },
      {
        $and: [
          { [sort]: { $eq: cursorModelSortValue } },
          { _id: { $gt: cursorModelIdValue } },
        ],
      },
    ])
    .limit(pageSize + 1)
    .sort({ [sort]: order })
    .find();

  return getPagination({
    Model,
    resultPlusOne,
    pageSize,
    page,
    filters,
    search,
    sort,
    order,
  });
};

export const getOffsetPagination = async (
  Model,
  {
    pageSize = 10,
    page = 0,
    filters = [],
    search = {},
    sort = 'createdAt',
    order = 'desc',
  } = {
    pageSize: 10,
    page: 0,
    filters: [],
    search: {},
    sort: 'createdAt',
    order: -1,
  }
) => {
  const resultPlusOne = await getQuery({ query: Model, search, filters })
    .sort({ [sort]: order })
    .skip(page * pageSize)
    .limit(pageSize + 1)
    .find();

  return getPagination({
    Model,
    resultPlusOne,
    pageSize,
    filters,
    search,
    sort,
    order,
  });
};
