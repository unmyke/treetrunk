import PieceRate from './piece-rate';
import connection, { contains as connectionContains } from './connection';
import operations, { contains as operationsContains } from './operations';
import args, { contains as typeArgsContains } from './args';

const contains = [
  PieceRate,
  ...connectionContains,
  ...operationsContains,
  ...typeArgsContains,
];

export { default } from './post';
export { contains, args, connection, operations };
