import PieceRate from './piece-rate';
import connection, { contains as connectionContains } from './connection';
import queries, { contains as queriesContains } from './queries';
import mutations, { contains as mutationsContains } from './mutations';

export { default } from './post';
export const contains = [
  PieceRate,
  ...connectionContains,
  ...queriesContains,
  ...mutationsContains,
];
export { connection, queries, mutations };
