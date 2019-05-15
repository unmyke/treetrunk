import { makeSchema, queryType, mutationType } from 'nexus';
import { resolve } from 'path';

// import { contains as connectionsContains } from './connections';
import { contains as argsContains } from './args';
import enums, { contains as enumsContains } from './enums';
import inputs, { contains as inputsContains } from './inputs';
import interfaces, { contains as interfacesContains } from './interfaces';
import scalars, { contains as scalarsContains } from './scalars';
import types, {
  contains as typesContains,
  connections as typeConnections,
  queries as typeQueries,
  mutations as typeMutations,
} from './types';
// import * as mutations from './mutations';

const Query = queryType({
  definition() {},
});

const Mutation = mutationType({
  definition() {},
});

const schema = makeSchema({
  types: [
    ...argsContains,
    ...typesContains,
    Query,
    Mutation,
    ...scalarsContains,
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
    typeQueries,
    typeMutations,
  ],
  outputs: { schema: resolve(__dirname, 'schema.graphql') },
});

export default schema;
