import * as queryFields from './query-fields';

const getQueries = (type) =>
  Object.keys(queryFields).reduce(
    (prevQueryFields, operationName) => ({
      ...prevQueryFields,
      ...queryFields[operationName](type),
    }),
    {}
  );

export default getQueries;
