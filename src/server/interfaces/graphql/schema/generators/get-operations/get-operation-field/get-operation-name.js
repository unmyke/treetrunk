import pluralize from 'pluralize';
import { lowerFirst } from 'lodash';
import { crudPredicates } from '@common';

const { isListGetter, isMultipleSetter, isGetter } = crudPredicates;

const getOperationName = ({ type: { name: typeName }, crudName }) => {
  if (isGetter(crudName)) {
    const lowerTypeName = lowerFirst(typeName);

    if (isListGetter(crudName)) return pluralize(lowerTypeName);
    return lowerTypeName;
  }
  if (isMultipleSetter(crudName)) return `${crudName}${pluralize(typeName)}`;

  return `${crudName}${typeName}`;
};

export default getOperationName;
