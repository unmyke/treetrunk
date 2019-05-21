const DATABASE_STATES = {
  CONNECTED: 0,
  CONNECTING: 1,
  DISCONNECTED: 2,
};

const MongoritoAdapter = ({ database }) => {
  const callWithConnectOnce = (fn) => (...args) => {
    const runFn = () => fn(...args);
    if (database.state === DATABASE_STATES.DISCONNECTED) {
      return database.connect().then(runFn());
    }

    return runFn();
  };

  const build = (Model, props) => new Model(props);
  const save = callWithConnectOnce((model) =>
    Promise.resolve(model.save()).then(() => model)
  );
  const destroy = callWithConnectOnce((model) => model.destroy());
  const get = (model, attr) => model.get(attr);
  const set = (props, model) => model.set(props);

  return Object.freeze({
    build,
    get,
    set,
    save,
    destroy,
  });
};
export default MongoritoAdapter;
