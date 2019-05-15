import { CRUDS } from '@common';
import * as crudOperations from './crud-operations';
import getOperationName from './get-operation-name';

const getCrudOperations = (
  EntityName,
  { entities, commonTypes, repositories }
) =>
  Object.values(CRUDS).reduce((prevOperations, crudName) => {
    const crudOperationGererator = crudOperations[crudName];
    const crudOperation =
      crudOperationGererator &&
      crudOperationGererator(EntityName)({
        entities,
        commonTypes,
        repositories,
      });

    return {
      ...prevOperations,
      [getOperationName({ EntityName, crudName })]: crudOperation,
    };
  }, {});

export default getCrudOperations;
