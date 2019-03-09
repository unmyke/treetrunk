import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
  isAbstractType,
  isCompositeType,
  isInputType,
  isLeafType,
  isOutputType,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'BaseConnection',
  fields: {},
});
