// import { GraphQLError } from 'graphql/error';
// import { Kind } from 'graphql/language';
import { scalarType } from 'nexus';
import { identity } from '@common';

// const phoneRegExp = /\+7 \d{3} \d{3}-\d{2}-\d{2}/;
// const isPhone = str => phoneRegExp.test(str)

const PhoneScalar = scalarType({
  name: 'PhoneScalar',
  asNexusMethod: 'phone',
  description: 'Phone number scalar type',
  serialize: identity,
  parseValue: (value) => {
    // TODO Validation
    return value;
  },
  parseLiteral(ast) {
    // TODO Validation
    return ast.value;
  },
});

export default PhoneScalar;
