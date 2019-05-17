import getListArgs, { contains as getListContains } from './get-list';
import idArg, { contains as idContains } from './id';

export default { getList: getListArgs, get: idArg, delete: idArg };
export const contains = [...getListContains, ...idContains];
