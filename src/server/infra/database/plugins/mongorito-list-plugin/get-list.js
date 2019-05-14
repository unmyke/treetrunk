import { PAGINATION_TYPES } from '@common';
import { getIdPropNameByModel } from '../../../_lib';

const emptyModel = { get: () => ({}) };

const getSortOrder = (type, rawOrder) => {
  const orderValue = rawOrder === 'asc' ? 1 : -1;
  const order = type === PAGINATION_TYPES.FORWARD ? orderValue : -orderValue;

  return order;
};

const getResultByType = (type, { models, hasBefore, hasAfter }) =>
  type === PAGINATION_TYPES.FORWARD
    ? { models, hasBefore, hasAfter }
    : { models: models.reverse(), hasBefore: hasAfter, hasAfter: hasBefore };

const getSortedQuery = (query, { sort: sortField, order }) =>
  query.sort(sortField, order).sort('_id', order);

const getFilteredQuery = (
  Model,
  { text: filterText, fields: filterFields = [] } = { fields: [] }
) => {
  const textFilterQuery = filterText
    ? Model.or(
        Model.textFilterFields().map((field) => ({
          [field]: new RegExp(filterText, 'i'),
        }))
      )
    : Model;

  const fieldsFilterQuery = filterFields.length
    ? textFilterQuery.and(
        filterFields.map(({ name, value }) => ({
          [name]: Array.isArray(value) ? { $in: value } : value,
        }))
      )
    : textFilterQuery;

  return fieldsFilterQuery;
};

const getResultAfterId = async ({
  Model,
  query,
  prevId,
  type,
  sort,
  order,
  count,
}) => {
  const prevModel = prevId
    ? await Model.findOne({ [getIdPropNameByModel(Model)]: prevId }).then(
        (model) => model || emptyModel
      )
    : emptyModel;

  const { [sort]: prevModelSortValue, _id: prevModelDBId } = prevModel.get();

  const modelsPlusOne = await (prevModelDBId
    ? query.or([
        { [sort]: { [order === 1 ? '$gt' : '$lt']: prevModelSortValue } },
        {
          $and: [
            { [sort]: { $eq: prevModelSortValue } },
            { _id: { [order === 1 ? '$gt' : '$lt']: prevModelDBId } },
          ],
        },
      ])
    : query
  )
    .limit(count + 1)
    .find();

  const hasAfter = modelsPlusOne.length > count;
  const models = hasAfter ? modelsPlusOne.slice(0, -1) : modelsPlusOne;

  return getResultByType(type, {
    models,
    hasAfter,
    hasBefore: Boolean(prevModelDBId),
  });
};

const getList = async (
  Model,
  {
    type = PAGINATION_TYPES.FORWARD,
    id: prevId,
    count = 10,
    filter,
    sort: { field: sort = 'createdAt', order: rawOrder = 'desc' } = {
      field: 'createdAt',
      order: 'desc',
    },
  } = {
    type: PAGINATION_TYPES.FORWARD,
    count: 10,
    sort: { field: 'createdAt', order: 'desc' },
  }
) => {
  const filteredQuery = getFilteredQuery(Model, filter);
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

export default getList;
