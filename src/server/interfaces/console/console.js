import REPL from 'repl';
import vm from 'vm';

export default ({ expose } = {}) => {
  const repl = REPL.start({
    eval: promisableEval,
  }).on('exit', () => {
    process.send('SIGINT');
    process.exit();
  });
  Object.assign(repl.context, expose);
};

const promisableEval = (cmd, context, _, callback) => {
  const result = vm.runInContext(cmd, context);

  if (isPromise(result)) {
    return result.then((v) => callback(null, v)).catch((e) => callback(e));
  }
  return callback(null, result);
};

const isPromise = (value) => {
  return (
    value &&
    typeof value.then === 'function' &&
    typeof value.catch === 'function'
  );
};
