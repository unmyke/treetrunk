export const makeError = (message, ...details) => {
  const error = new Error(message);
  error.details = details;
  return error;
};
