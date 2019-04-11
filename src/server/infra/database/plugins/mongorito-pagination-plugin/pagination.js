import { encode } from './base64';

const getResults = (error, data) => {
  if (error) {
    throw error;
  }
  return data;
};

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
  const result = hasMore ? resultPlusOne.slice(0, -1) : resultPlusOne;
  const id = result[result.length - 1][getIdPropName(Model)];
  const cursor = encode({
    id,
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
  const cursorModelSortValue = cursorModel.get(sort);
  const cursorModelIdValue = cursorModel.get('_id');

  const resultPlusOne = getQuery({ query: Model, search, filters })
    .where({ [sort]: { [order === 1 ? 'gt' : 'lt']: cursorModelSortValue } })
    .or([{ [sort]: { eq: cursorModelSortValue } }])
    .and({ _id: { gte: cursorModelIdValue } })
    .sort({ [sort]: order })
    .limit(pageSize + 1);

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
    .limit(pageSize + 1);

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
