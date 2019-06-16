import { queryField } from 'nexus';

import args from './args';
import resolve from './resolver';

const nodeQuery = (ctx) => {
  const {
    interfaces: { Node },
  } = ctx;

  return queryField('node', {
    type: Node,
    args: args(ctx),
    resolve,
  });
};
export default nodeQuery;
