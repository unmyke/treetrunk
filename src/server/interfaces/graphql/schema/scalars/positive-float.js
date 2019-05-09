// import { GraphQLError } from 'graphql/error';
// import { Kind } from 'graphql/language';
import { scalarType } from 'nexus';
import { identity } from '@common';
import roundTo from './round-to';

const PositiveFloatScalar = scalarType({
  name: 'PositiveFloatScalar',
  asNexusMethod: 'positiveFloat',
  description: 'Positive float with two digit after point custom scalar type',
  serialize: identity,
  parseValue: (value) => {
    // TODO validation
    return roundTo(value);
  },
  parseLiteral: (ast) => {
    // TODO validation
    return roundTo(ast.value);
  },
});

export default PositiveFloatScalar;
