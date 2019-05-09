import { scalarType } from 'nexus';
import { Cursor as cursorSerializer } from '../../serializers';

const CursorScalar = scalarType({
  name: 'CursorScalar',
  asNexusMethod: 'cursor',
  serialize: cursorSerializer.serialize,
  parseValue: (value) => {
    // TODO Validation
    return cursorSerializer.parse(value);
  },
  parseLiteral: (ast) => {
    // TODO Validation
    return cursorSerializer.parse(ast.value);
  },
});

export default CursorScalar;
