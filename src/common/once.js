import makeError from './make-error';

const commonOnceError = makeError('COMMON_ONCE');

const once = (fn) => {
  if (!typeof fn === 'function') {
    throw commonOnceError('Passed argument is not a function');
  }

  let run = false;
  let result;

  return (...args) => {
    if (!run) {
      run = true;
      result = fn(...args);
      return result;
    }

    return result;
  };
};

export default once;
