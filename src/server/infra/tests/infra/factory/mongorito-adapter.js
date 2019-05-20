import { once } from '@common';

const MongoritoAdapter = ({ database }) => {
  const connectOnce = once((database) => database.connect());
  const callWithConnectOnce = (fn) => (...args) =>
    connectOnce(database).then(() => fn(...args));

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
