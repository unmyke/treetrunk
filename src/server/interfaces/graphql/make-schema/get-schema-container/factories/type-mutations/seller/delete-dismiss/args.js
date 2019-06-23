const deleteDismissArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('DeleteSellerDismissInput', (t) => {
    t.id('id', { required: true });
  });
};
export default deleteDismissArgs;
