import { queryField } from 'nexus';

import getArgs from './args';
import resolve from './resolver';

const nodeQuery = (ctx) => {
  const {
    interfaces: { Node },
  } = ctx;
  const args = getArgs(ctx);

  return queryField('node', {
    type: Node,
    args,
    resolve,
  });
};
export default nodeQuery;
