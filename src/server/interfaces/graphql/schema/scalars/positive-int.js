// import { GraphQLError } from 'graphql/error';
// import { Kind } from 'graphql/language';
import { scalarType } from 'nexus';
import { identity } from '@common';

const PositiveIntScalar = scalarType({
  name: 'PositiveIntScalar',
  asNexusMethod: 'positiveInt',
  description: 'PositiveInt custom scalar type',
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

export default PositiveIntScalar;
