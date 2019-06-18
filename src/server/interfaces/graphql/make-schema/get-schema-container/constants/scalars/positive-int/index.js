import { scalarType } from 'nexus';

import { serialize, parse } from './utils';

const PositiveIntScalar = scalarType({
  name: 'PositiveIntScalar',
  description: 'PositiveInt custom scalar type',
  serialize,
  parseValue: (value) => {
    // TODO validation
    return parse(value);
  },
  parseLiteral: (ast) => {
    // TODO validation
    return parse(parseInt(ast.value, 10));
  },
});

export default PositiveIntScalar;
