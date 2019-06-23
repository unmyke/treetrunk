import { makeSchema } from 'nexus';
import { resolve } from 'path';

import getSchemaContainer from './get-schema-container';

const schema = (getServiceName) => {
  const { queries, typeMutations, mutations } = getSchemaContainer(
    getServiceName
  );

  return makeSchema({
    types: [queries, typeMutations, mutations],
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
