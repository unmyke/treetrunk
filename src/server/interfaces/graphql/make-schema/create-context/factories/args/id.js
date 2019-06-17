const idArgs = ({ utils: { getOperationArgs } }) =>
  getOperationArgs('IdInput', (t) => {
    t.id('id', { required: true });
  });
export default idArgs;
