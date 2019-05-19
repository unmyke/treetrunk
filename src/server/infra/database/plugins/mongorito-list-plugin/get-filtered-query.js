const getFilteredQuery = (
  Model,
  { text: filterText, fields: filterFields = [] } = { fields: [] },
  where
) => {
  const whereQuery = where ? Model.where(where) : Model;

  const textFilterQuery = filterText
    ? whereQuery.or(
        Model.textFilterFields().map((field) => ({
          [field]: new RegExp(filterText, 'i'),
        }))
      )
    : whereQuery;

  const fieldsFilterQuery = filterFields.length
    ? textFilterQuery.and(
        filterFields.map(({ name, value }) => ({
          [name]: Array.isArray(value) ? { $in: value } : value,
        }))
      )
    : textFilterQuery;

  return fieldsFilterQuery;
};

export default getFilteredQuery;
