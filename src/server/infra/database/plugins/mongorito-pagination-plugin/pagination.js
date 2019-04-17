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

const getPaginagtion = ({
  Model,
  resultPlusOne,
  pageSize,
  filters,
  search,
  sort,
  order,
}) => {
  const hasMore = resultPlusOne.length > pageSize;
  const result = (hasMore ? resultPlusOne.slice(0, -1) : resultPlusOne).map(
    (item) => item.get()
  );
  const id = result.length
    ? result[result.length - 1][getIdPropName(Model)]
    : null;
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

export const getCursorPaginagtion = async (
  Model,
  {
    id: prevId,
    pageSize = 10,
    filters = [],
    search = {},
    sort = 'createdAt',
    order = 'desc',
  } = {
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
    .where(sort)
    [order === 1 ? 'gte' : 'lte'](cursorModelSortValue)
    .where('_id')
    .ne(cursorModelIdValue)
    .limit(pageSize + 1)
    .sort({ [sort]: order })
    .find();

  return getPaginagtion({
    Model,
    resultPlusOne,
    pageSize,
    filters,
    search,
    sort,
    order,
  });
};

export const getOffsetPaginagtion = async (
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

  return getPaginagtion({
    Model,
    resultPlusOne,
    pageSize,
    filters,
    search,
    sort,
    order,
  });
};
