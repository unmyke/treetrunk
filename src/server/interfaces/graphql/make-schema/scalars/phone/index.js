import { scalarType } from 'nexus';

import { serialize, parse } from './utils';

const PhoneScalar = scalarType({
  name: 'PhoneScalar',
  asNexusMethod: 'phone',
  description: 'Phone number scalar type',
  serialize,
  parseValue: (value) => {
    // TODO Validation
    return parse(value);
  },
  parseLiteral(ast) {
    // TODO Validation
    return parse(ast.value);
  },
});

export default PhoneScalar;
