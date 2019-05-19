import { lowerCase, upperFirst } from 'lodash';

const makeError = (message) => (detail) => {
  const err = new Error(message);
  err.title = upperFirst(lowerCase(message));
  err.code = message;
  err.detail = detail;

  return err;
};

export default makeError;
