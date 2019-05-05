import { makeSchema } from 'nexus';
import { resolve } from 'path';

import * as connections from './connections';
import * as enums from './enums';
import * as inputs from './inputs';
import * as interfaces from './interfaces';
import * as queries from './queries';
import * as scalars from './scalars';
import * as types from './types';
// import * as mutations from './mutations';

const schema = makeSchema({
  types: [connections, enums, inputs, interfaces, queries, scalars, types],
  outputs: { schema: resolve(__dirname, 'schema.graphql') },
});

export default schema;
