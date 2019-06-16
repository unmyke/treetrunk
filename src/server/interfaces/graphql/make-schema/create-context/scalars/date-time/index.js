import { scalarType } from 'nexus';

import { serialize, parse } from './utils';

const DateScalar = scalarType({
  name: 'DateTimeScalar',
  serialize,
  parseValue: (value) => {
    // TODO vaildation
    return parse(value);
  },
  parseLiteral: (ast) => {
    // TODO vaildation
    return parse(ast.value);
  },
});

export default DateScalar;
