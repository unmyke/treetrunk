import Award from './award';
import connection, { contains as connectionContains } from './connection';
import operations, { contains as operationsContains } from './operations';

export { default } from './seniority-type';
export const contains = [Award, ...connectionContains, ...operationsContains];
export { connection, operations };
