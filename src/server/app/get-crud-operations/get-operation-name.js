import plurilize from 'pluralize';

const getOperationName = ({ EntityName, crudName }) => {
  const entitySufix = /Many|List/.test(crudName)
    ? plurilize(EntityName)
    : EntityName;

  return `${crudName}${entitySufix}`;
};

export default getOperationName;
