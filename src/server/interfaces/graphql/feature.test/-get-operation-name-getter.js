import { lowerFirst } from 'lodash';
import pluralize from 'pluralize';
import { crudPredicates } from '@common';

const { isGetter, isListGetter, isSetter, isMultipleSetter } = crudPredicates;

const getOperationNameGetter = (EntityName) => (operationName) => {
  switch (true) {
    case isListGetter(operationName):
      return pluralize(lowerFirst(EntityName));
    case isGetter(operationName):
      return lowerFirst(EntityName);
    case isMultipleSetter(operationName):
      return `${operationName}${pluralize(EntityName)}`;
    case isSetter(operationName):
      return `${operationName}${EntityName}`;

    default:
      throw new Error('incorrect operation name');
  }
};
export default getOperationNameGetter;
