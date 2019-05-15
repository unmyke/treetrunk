import plurilize from 'pluralize';

const getOperationName = ({ typeName, crudName }) => {
  const entitySufix = /Many|List/.test(crudName)
    ? plurilize(typeName)
    : typeName;

  return `${crudName}${entitySufix}`;
};

export default getOperationName;
