import { scalarType } from 'nexus';
import { serialize, parse } from './utils';

const CursorScalar = scalarType({
  name: 'CursorScalar',
  asNexusMethod: 'cursor',
  serialize,
  parseValue: (value) => {
    // TODO Validation
    return parse(value);
  },
  parseLiteral: (ast) => {
    // TODO Validation
    return parse(ast.value);
  },
});

export default CursorScalar;
