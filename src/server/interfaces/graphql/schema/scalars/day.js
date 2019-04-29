import { scalarType } from 'nexus';

const Day = scalarType({
  name: 'Day',
  asNexusMethod: 'day',
  description: 'Day custom scalar type',
  parseValue: (value) => new Date(value),
  serialize: (value) => value.getTime(),
  parseLiteral: (ast) => (ast.kind === 'IntValue' ? new Date(ast.value) : null),
});

export default Day;
