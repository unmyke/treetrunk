import Award from './award';
import connection, { contains as connectionContains } from './connection';
import queries, { contains as queriesContains } from './queries';

export { default } from './seniority-type';
export const contains = [Award, ...connectionContains, ...queriesContains];
export { connection, queries };
