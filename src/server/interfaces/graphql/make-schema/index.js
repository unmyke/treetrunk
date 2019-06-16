import { makeSchema, queryType, mutationType } from 'nexus';
import { resolve } from 'path';

import createContext from './create-context';

const Query = queryType({
  definition() {},
});

const Mutation = mutationType({
  definition() {},
});

const schema = (getServiceName) => {
  const context = createContext(getServiceName);

  return makeSchema({
    types: [Query, Mutation, context.operations],
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
