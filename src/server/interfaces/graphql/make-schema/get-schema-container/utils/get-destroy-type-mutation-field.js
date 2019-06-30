import { CRUDS } from '@common';

const getCreateTypeMutationField = (ctx) => {
  const {
    utils: { getCrudOperationField },
  } = ctx;

  return getCrudOperationField(CRUDS.DESTROY);
};
export default getCreateTypeMutationField;
