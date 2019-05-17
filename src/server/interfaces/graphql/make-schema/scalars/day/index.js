import { scalarType } from 'nexus';

import { serialize, parse } from './utils';

const DayScalar = scalarType({
  name: 'DayScalar',
  asNexusMethod: 'day',
  description: 'Day custom scalar type',
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

export default DayScalar;
