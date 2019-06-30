const getQueries = (ctx) => (queries) =>
  Object.entries(queries).reduce((prevQueries, [queryName, query]) => ({
    ...prevQueries,
    [queryName]: query(ctx),
  }));
export default getQueries;
