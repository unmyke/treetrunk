import { CRUDS } from '@common';
import getOperationField from './get-operation-field';

const getOperationFields = (ctx) => ({ type, args, getResolver }) =>
  Object.values(CRUDS).reduce(
    (prevOperationFields, crudName) => ({
      ...prevOperationFields,
      ...getOperationField({ type, crudName, args, getResolver }),
    }),
    {}
  );

export default getOperationFields;
