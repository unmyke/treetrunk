import { makeSchema } from 'nexus';
import { resolve } from 'path';

import createContext from './create-context';

const schema = (getServiceName) => {
  const context = createContext(getServiceName);

  return makeSchema({
    types: context.operations,
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
