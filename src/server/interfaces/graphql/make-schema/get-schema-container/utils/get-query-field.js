import * as operationTypes from './operation-types';
import getOperationFieldFactory from './get-operation-field';

const getQueryField = (ctx) => {
  const getOperationField = getOperationFieldFactory(ctx);
  return getOperationField(operationTypes.QUERY);
};
export default getQueryField;
