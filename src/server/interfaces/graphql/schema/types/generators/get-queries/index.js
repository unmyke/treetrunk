import getTypeQueryField from './get-type-query-field';
import getConnectionQueryField from './get-connection-query-field';

const getQueries = (type) => ({
  ...getTypeQueryField(type),
  ...getConnectionQueryField(type),
});

export default getQueries;
