import { CRUDS } from '@common';

const getCreateTypeMutationField = (ctx) => {
  const {
    utils: { getCrudOperationField },
  } = ctx;

  return getCrudOperationField(CRUDS.UPDATE);
};
export default getCreateTypeMutationField;
