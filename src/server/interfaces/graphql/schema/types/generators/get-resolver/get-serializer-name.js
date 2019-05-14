import pluralize from 'pluralize';

const getSerializerName = (typeName, operation) =>
  /Many|List/.test(operation) ? pluralize(typeName) : typeName;

export default getSerializerName;
