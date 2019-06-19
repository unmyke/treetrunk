const deletePieceRateArgs = (ctx) => {
  const {
    interfaces: { TypeOperationInputInterface },
    scalars: { Day },
    utils: { getOperationArgs },
  } = ctx;

  return getOperationArgs('DeletePostPieceRateInput', (t) => {
    t.implements(TypeOperationInputInterface);
    // t.id('id', { required: true });
    t.field('day', { type: Day, required: true });
  });
};
export default deletePieceRateArgs;
