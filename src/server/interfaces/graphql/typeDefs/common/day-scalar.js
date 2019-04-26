import { scalarType } from 'nexus';

const DayScalar = scalarType({
  name: 'DayScalar',
  asNexusMethod: 'day',
  description: 'Day custom scalar type',
  parseValue: (value) => new Date(value),
  serialize: (value) => value.getTime(),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});

export default DayScalar;
