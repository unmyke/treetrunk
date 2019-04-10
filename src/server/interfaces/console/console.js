import REPL from 'repl';
import vm from 'vm';

export default {
  start(options = {}) {
    const { expose } = options;

    const repl = REPL.start({
      eval: promisableEval,
    });
    Object.assign(repl.context, expose);
  },
};

function promisableEval(cmd, context, _, callback) {
  const result = vm.runInContext(cmd, context);

  if (isPromise(result)) {
    return result.then((v) => callback(null, v)).catch((e) => callback(e));
  }

  return callback(null, result);
}

function isPromise(value) {
  return (
    value &&
    typeof value.then === 'function' &&
    typeof value.catch === 'function'
  );
}
