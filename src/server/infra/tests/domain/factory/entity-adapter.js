const Adapter = (store) => {
  const build = (Model, props) => {
    return Model.restore(props);
  };

  const save = (model, Model) => {
    return model.save();
  };

  const destroy = (model, Model) => {
    return model.destroy();
  };

  const get = (model, attr, Model) => {
    return model.get(attr);
  };

  const set = (props, model, Model) => {
    return model.set(props);
  };

  return Object.freeze({
    build,
    save,
    destroy,
    get,
    set,
  });
};

export default Adapter;
