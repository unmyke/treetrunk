import { scalarType } from 'nexus';
import { Day as daySerializer } from '../../serializers';

const DayScalar = scalarType({
  name: 'DayScalar',
  asNexusMethod: 'day',
  description: 'Day custom scalar type',
  serialize: daySerializer.serialize,
  parseValue: (value) => {
    // TODO vaildation
    return daySerializer.parse(value);
  },
  parseLiteral: (ast) => {
    // TODO vaildation
    return daySerializer.parse(ast.value);
  },
});

export default DayScalar;
