import { makeSchema } from 'nexus';

import * as types from './types';
import * as queries from './queries';
import * as mutations from './mutations';

const schema = makeSchema(types, queries, mutations);

export default schema;
