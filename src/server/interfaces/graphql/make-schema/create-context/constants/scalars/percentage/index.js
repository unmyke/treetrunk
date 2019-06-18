import { scalarType } from 'nexus';

import { serialize, parse } from './utils';

const PercentageScalar = scalarType({
  name: 'PercentageScalar',
  description: 'Percentage custom scalar type',
  serialize,
  parseValue: (value) => {
    // TODO validation
    return parse(value);
  },
  parseLiteral: (ast) => {
    // TODO validation
    return parse(ast.value);
  },
});

export default PercentageScalar;
