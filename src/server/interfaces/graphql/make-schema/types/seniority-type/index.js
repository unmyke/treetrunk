import Award from './award';
import connection, { contains as connectionContains } from './connection';
import * as operations from './operations';
import * as inputs from './inputs';
import * as args from './args';

export { default } from './seniority-type';
const contains = [Award, inputs, ...connectionContains];
export { contains, connection, operations, args };
