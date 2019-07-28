import pluralize from 'pluralize';
import { crudPredicates } from '@common';

const { isListGetter } = crudPredicates;

const getSerializerName = ({ typeName, crudName }) =>
  isListGetter(crudName) ? pluralize(typeName) : typeName;

export default getSerializerName;
