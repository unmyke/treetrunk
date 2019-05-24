const STATE_DISCONNECT = 2;

export default () => {
  return ({ modelClass }) => (next) => (action) => {
    if (modelClass.database.state === STATE_DISCONNECT) {
      return modelClass.database.connect().then(() => next(action));
    }
    return next(action);
  };
};
