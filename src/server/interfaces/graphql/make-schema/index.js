import { makeSchema } from 'nexus';
import { resolve } from 'path';

import getSchemaContainer from './get-schema-container';

const schema = (getServiceName) => {
  const container = getSchemaContainer(getServiceName);

  return makeSchema({
    types: container.operations,
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
