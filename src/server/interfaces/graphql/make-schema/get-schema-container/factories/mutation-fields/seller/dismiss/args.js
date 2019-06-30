const dismissArgs = (ctx) => {
  const {
    scalars: { Day },
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('SellerDismissInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: Day, required: false });
  });
};
export default dismissArgs;
