import resolve from './resolver';

const nodeQuery = (ctx) => {
  const {
    interfaces: { Node },
    args: { cursor: cursorArgs },
    utils: { getQueryField },
  } = ctx;

  return getQueryField({
    name: 'node',
    type: Node,
    args: cursorArgs,
    resolve,
  });
};
export default nodeQuery;
