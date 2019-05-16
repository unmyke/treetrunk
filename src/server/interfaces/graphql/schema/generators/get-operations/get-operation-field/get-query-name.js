import pluralize from 'pluralize';
import { lowerFirst } from 'lodash';
import { crudPredicates } from '@common';

const { isListGetter } = crudPredicates;

const getQeryName = ({ type: { name: typeName }, crudName }) => {
  const lowerTypeName = lowerFirst(typeName);
  return isListGetter(crudName) ? pluralize(lowerTypeName) : lowerTypeName;
};
export default getQeryName;
