import { getIdPropNameByModel } from '@infra/_lib';

import emptyModel from './empty-model';
import getResultByType from './get-result-by-type';

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

export default getResultAfterId;
