import Award from './award';
import connection, { contains as connectionContains } from './connection';
import operations, { contains as operationsContains } from './operations';
import args, { contains as argsContains } from './args';

export { default } from './seniority-type';
export const contains = [
  Award,
  ...connectionContains,
  ...argsContains,
  ...operationsContains,
];
export { connection, operations, args };
