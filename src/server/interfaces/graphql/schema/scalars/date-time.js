import { scalarType } from 'nexus';

import { DateTime as dateTimeSerializer } from '../../serializers';

const DateScalar = scalarType({
  name: 'DateTimeScalar',
  asNexusMethod: 'dateTime',
  serialize: dateTimeSerializer.serialize,
  parseValue: (value) => {
    // TODO vaildation
    return dateTimeSerializer.parse(value);
  },
  parseLiteral: (ast) => {
    // TODO vaildation
    return dateTimeSerializer.parse(ast.value);
  },
});

export default DateScalar;
