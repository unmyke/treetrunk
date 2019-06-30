import { CRUDS } from '@common';

const getCreateTypeMutationField = (ctx) => {
  const {
    utils: { getCrudOperationField },
  } = ctx;

  return getCrudOperationField(CRUDS.CREATE);
};
export default getCreateTypeMutationField;
