import Appontment from './appontment';
import StateEnum from './state-enum';
import connection, { contains as connectionContains } from './connection';
import operations, { contains as operationsContains } from './operations';

// import * as resolvers from './resolvers';
// import * as queries from './queries';

export { default } from './seller';
export const contains = [
  StateEnum,
  Appontment,
  ...connectionContains,
  ...operationsContains,
];
export { connection, operations };
