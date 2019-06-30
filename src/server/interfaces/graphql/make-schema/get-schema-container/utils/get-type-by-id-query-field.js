import { CRUDS } from '@common';

const getTypeByIdQueryField = (ctx) => {
  const {
    utils: { getCrudOperationField },
  } = ctx;

  return getCrudOperationField(CRUDS.GET);
};
export default getTypeByIdQueryField;
