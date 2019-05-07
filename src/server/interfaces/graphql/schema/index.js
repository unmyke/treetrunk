import { makeSchema } from 'nexus';
import { resolve } from 'path';

import connections, { contains as connectionsContains } from './connections';
import * as enums from './enums';
import * as inputs from './inputs';
import * as interfaces from './interfaces';
import queries, { contains as queriesContains } from './queries';
import * as scalars from './scalars';
import typesContains, * as types from './types';
// import * as mutations from './mutations';

const schema = makeSchema({
  types: [
    enums,
    inputs,
    interfaces,
    scalars,
    connectionsContains,
    connections,
    typesContains,
    types,
    queriesContains,
    queries,
  ],
  outputs: { schema: resolve(__dirname, 'schema.graphql') },
});

export default schema;
