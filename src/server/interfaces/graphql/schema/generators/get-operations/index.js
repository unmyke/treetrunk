import { CRUDS } from '@common';
import getOperationField from './get-operation-field';

const getOperationFields = ({ type, args }) =>
  Object.values(CRUDS).reduce(
    (prevOperationFields, crudName) => ({
      ...prevOperationFields,
      ...getOperationField({ type, crudName, args }),
    }),
    {}
  );

export default getOperationFields;
