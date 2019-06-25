import resolve from './resolver';

const nodeQuery = (ctx) => {
  const {
    interfaces: { Node },
    args: { cursor: cursorArgs },
    utils: { getQuery },
  } = ctx;

  return getQuery({
    name: 'node',
    type: Node,
    args: cursorArgs,
    resolve,
  });
};
export default nodeQuery;
