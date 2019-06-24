import { makeSchema } from 'nexus';
import { resolve } from 'path';

import getSchemaContainer from './get-schema-container';

const resolveContainer = (container) =>
  (typeof container.$list === 'function' ? container.$list() : []).reduce(
    (prevItems, itemName) => ({
      ...prevItems,
      [itemName]: container[itemName],
    }),
    {}
  );

const schema = (getServiceName) => {
  const {
    queries: queryContainer,
    typeMutations: typeMutationsContainer,
    // mutations: typeMutationsContainer,
  } = getSchemaContainer(getServiceName);

  const queries = resolveContainer(queryContainer);
  const typeMutations = resolveContainer(typeMutationsContainer);
  // const mutations = mutationsContainer

  return makeSchema({
    types: [
      // Query,
      // Mutation,
      queries,
      typeMutations,
      // mutations
    ],
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
