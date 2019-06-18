import { scalarType } from 'nexus';

import { serialize, parse } from './utils';

const PositiveFloatScalar = scalarType({
  name: 'PositiveFloatScalar',
  description: 'Positive float with two digit after point custom scalar type',
  serialize,
  parseValue: (value) => {
    // TODO validation
    return parse(value);
  },
  parseLiteral: (ast) => {
    // TODO validation
    return parse(parseFloat(ast.value));
  },
});

export default PositiveFloatScalar;
