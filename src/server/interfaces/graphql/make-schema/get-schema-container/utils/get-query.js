import { queryField as getQueryField } from 'nexus';

const getQuery = () => {
  return (name, query) => {
    const queryField = getQueryField(name, query);
    return queryField;
  };
};
export default getQuery;
