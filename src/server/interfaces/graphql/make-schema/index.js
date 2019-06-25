import { makeSchema } from 'nexus';
import { resolve } from 'path';

import getSchemaContainer from './get-schema-container';
import resolveContainer from './resolve-container';

const schema = (getServiceName) => {
  const {
    interfaces: interfacesContainer,
    queries: queryContainer,
    typeMutations: typeMutationsContainer,
    // mutations: typeMutationsContainer,
  } = getSchemaContainer(getServiceName);

  const interfaces = resolveContainer(interfacesContainer);
  const queries = resolveContainer(queryContainer);
  const typeMutations = resolveContainer(typeMutationsContainer);
  // const mutations = mutationsContainer

  return makeSchema({
    types: [
      // Query,
      // Mutation,
      interfaces,
      queries,
      typeMutations,
      // mutations
    ],
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
