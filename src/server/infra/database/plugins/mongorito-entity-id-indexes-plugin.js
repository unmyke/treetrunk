export default () => {
  return ({ getState, dispatch, model, modelClass }) => (next) => (action) => {
    return next(action);
  };
};
