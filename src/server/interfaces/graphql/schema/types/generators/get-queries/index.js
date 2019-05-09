import getTypeQueryField from './get-type-query-field';
import getConnectionQueryField from './get-connection-query-field';

const getQueries = ({ name }) => ({
  ...getTypeQueryField(name),
  ...getConnectionQueryField(name),
});

export default getQueries;
