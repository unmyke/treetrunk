import { CRUDS } from '@common';
import * as crudOperations from './crud-operations';

const getCrudOperations = (
  EntityName,
  { entities, commonTypes, repositories }
) =>
  Object.values(CRUDS).reduce((prevOperations, { name, getOperationName }) => {
    const crudOperationGererator = crudOperations[name];
    const crudOperation =
      crudOperationGererator &&
      crudOperationGererator(EntityName)({
        entities,
        commonTypes,
        repositories,
      });

    return {
      ...prevOperations,
      [getOperationName(EntityName)]: crudOperation,
    };
  }, {});

export default getCrudOperations;
