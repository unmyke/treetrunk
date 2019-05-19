import METHOD_TYPES from './method-types';

const makePlugin = (type) => (method) => (Model) => {
  const targetForMethod =
    type === METHOD_TYPES.INSTANCE ? Model.prototype : Model;
  const plugin = method(Model);

  targetForMethod[method.name] = plugin;
};

export default makePlugin;
