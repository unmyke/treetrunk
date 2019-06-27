import pluralize from 'pluralize';
import getTypeQueryName from './get-type-query-name';

const getTypeListQueryName = ({ name }) => pluralize(getTypeQueryName(name));
export default getTypeListQueryName;
