import * as operationTypes from './operation-types';
import getOperationFieldFactory from './get-operation-field';

const getMutationField = (ctx) => {
  const getOperationField = getOperationFieldFactory(ctx);
  return getOperationField(operationTypes.MUTATION);
};
export default getMutationField;
