import Connection, { contains as connectionContains } from './connection';
import Type, { contains as typeContains } from './type';

export default { Connection, Type };
export const contains = [...connectionContains, ...typeContains];
