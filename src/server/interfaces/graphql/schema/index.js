import { makeSchema } from 'nexus';

import * as scalars from './scalars';
import * as types from './types';
import * as queries from './queries';
// import * as mutations from './mutations';

const schema = makeSchema({
  types: [scalars, types, queries],
  outputs: { schema: __dirname + 'schema.graphql' },
});

export default schema;
