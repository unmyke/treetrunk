const cursorArgs = (ctx) => {
  const {
    utils: { getOperationArgs },
    scalars: { Cursor },
  } = ctx;

  return getOperationArgs('CursorInput', (t) => {
    t.field('cursor', { type: Cursor, required: true });
  });
};

export default cursorArgs;
