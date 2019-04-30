import { scalarType } from 'nexus';

const Phone = scalarType({
  name: 'Phone',
  asNexusMethod: 'phone',
  description: 'Phone number scalar type',
  serialize: (value) => value.toString(),
  parseValue: (value) => value,
  parseLiteral: (ast) => (ast.kind === 'StringValue' ? ast.value : null),
});

export default Phone;
