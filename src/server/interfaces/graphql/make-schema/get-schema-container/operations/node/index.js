import { queryField } from 'nexus';

import resolve from './resolver';

const nodeQuery = (ctx) => {
  const {
    interfaces: { Node },
    args: { cursor: cursorArgs },
  } = ctx;

  return queryField('node', {
    type: Node,
    args: cursorArgs,
    resolve,
  });
};
export default nodeQuery;
