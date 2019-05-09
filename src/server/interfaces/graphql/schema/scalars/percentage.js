// import { GraphQLError } from 'graphql/error';
// import { Kind } from 'graphql/language';
import { scalarType } from 'nexus';
import { identity } from '@common';

const PercentageScalar = scalarType({
  name: 'PercentageScalar',
  asNexusMethod: 'percentage',
  description: 'Percentage custom scalar type',
  serialize: identity,
  parseValue: (value) => {
    // TODO validation
    return value;
  },
  parseLiteral: (ast) => {
    // TODO validation
    return ast.value;
  },
});

export default PercentageScalar;
