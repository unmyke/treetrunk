const NodeInput = ({ utils: { getOperationArgs }, scalars: { Cursor } }) =>
  getOperationArgs('CursorInput', (t) => {
    t.field('cursor', { type: Cursor, required: true });
  });

export default NodeInput;
