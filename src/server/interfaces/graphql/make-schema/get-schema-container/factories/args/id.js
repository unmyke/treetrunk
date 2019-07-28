const idArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('IdInput', (t) => {
    t.id('id', { required: true });
  });
};
export default idArgs;
