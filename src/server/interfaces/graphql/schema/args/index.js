import getList, { contains as getListContains } from './get-list';
import get, { contains as getContains } from './get';

export default { getList, get };
export const contains = [...getListContains, ...getContains];
