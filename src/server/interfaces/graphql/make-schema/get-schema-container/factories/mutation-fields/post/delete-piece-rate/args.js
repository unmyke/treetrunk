const deletePieceRateArgs = (ctx) => {
  const {
    scalars: { Day },
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('DeletePostPieceRateInput', (t) => {
    t.id('id', { required: true });
    t.field('day', { type: Day, required: true });
  });
};
export default deletePieceRateArgs;
