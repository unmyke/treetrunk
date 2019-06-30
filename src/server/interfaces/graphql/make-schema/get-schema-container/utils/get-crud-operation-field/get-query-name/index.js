import { crudPredicates } from '@common';
import getTypeQueryName from './get-type-query-name';
import getTypeListQueryName from './get-type-list-query-name';

const { isListGetter } = crudPredicates;

const getQueryName = ({ crudName, type }) =>
  isListGetter(crudName) ? getTypeListQueryName(type) : getTypeQueryName(type);
export default getQueryName;
