import { CRUDS } from '@common';

const getTypeListQueryField = (ctx) => {
  const {
    utils: { getCrudOperationField },
  } = ctx;

  return getCrudOperationField(CRUDS.GET_LIST);
};
export default getTypeListQueryField;
