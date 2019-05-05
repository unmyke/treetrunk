import { scalarType } from 'nexus';

const Date = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue: (value) => new Date(value),
  serialize: (value) => value.getTime(),
  parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
});

export default Date;
