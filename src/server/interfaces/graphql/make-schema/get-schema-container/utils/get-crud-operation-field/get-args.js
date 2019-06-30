import { CRUDS } from '@common';

const getArgs = ({ ctx, crudName }) => {
  const {
    args: { id, list },
  } = ctx;

  switch (crudName) {
    case CRUDS.DESTROY:
    case CRUDS.DELETE:
    case CRUDS.RESTORE:
    case CRUDS.GET:
      return id;
    case CRUDS.GET_LIST:
      return list;
    default:
      return null;
  }
};
export default getArgs;
