import { scalarType } from 'nexus';
import { identity } from '@common';

const Cursor = scalarType({
  name: 'Cursor',
  asNexusMethod: 'cursor',
  serialize: identity,
  parseValue: identity,
  parseLiteral: (ast) => (ast.kind === 'StringValue' ? ast.value : null),
});

export default Cursor;
