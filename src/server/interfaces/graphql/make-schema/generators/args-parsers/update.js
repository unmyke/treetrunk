export default ({ id, ...fields }) => [
  id,
  Object.keys(fields).reduce(
    (prevUpdateFields, fieldKey) => ({
      ...prevUpdateFields,
      ...fields[fieldKey],
    }),
    {}
  ),
];
