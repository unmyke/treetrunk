import { makeSchema, queryType, mutationType } from 'nexus';
import { resolve } from 'path';

import { getOperations, makeGetResolver } from './generators';
import args, { contains as argsContains } from './args';
import enums, { contains as enumsContains } from './enums';
import inputs, { contains as inputsContains } from './inputs';
import interfaces, { contains as interfacesContains } from './interfaces';
import operations, { contains as operationsContains } from './operations';
import * as scalars from './scalars';
import types, {
  contains as typesContains,
  connections as typeConnections,
  operations as typeOperations,
  args as typeArgs,
} from './types';
// import * as mutations from './mutations';

const Query = queryType({
  definition() {},
});

const Mutation = mutationType({
  definition() {},
});

const schema = (getServiceName) => {
  const getResolver = makeGetResolver(getServiceName);

  const crudOperations = Object.keys(types).reduce(
    (prevCrudOperations, typeName) => ({
      ...prevCrudOperations,
      [typeName]: getOperations({
        type: types[typeName],
        args: { ...typeArgs[typeName], ...args },
        getResolver,
      }),
    }),
    {}
  );

  return makeSchema({
    types: [
      ...argsContains,
      ...typesContains,
      Query,
      Mutation,
      scalars,
      ...enumsContains,
      enums,
      ...inputsContains,
      inputs,
      ...interfacesContains,
      interfaces,
      ...typesContains,
      types,
      typeConnections,
      ...operationsContains,
      operations,
      crudOperations,
      typeOperations,
    ],
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
