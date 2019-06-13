const use = (Factory) => (argsTransform) => (...args) =>
  Factory(argsTransform(...args));
export default use;
