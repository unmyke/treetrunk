const dispatchError = (originalError, errorMessageMapper) => {
  const error = errorMessageMapper[originalError.message];

  if (error === undefined) {
    return originalError;
  }

  error.originalError = originalError;
  return error;
};

export const getAsyncOperationRunner = (errorMessageMapper) => (operation) => {
  return operation().then(
    (res) => res,
    (error) => {
      throw dispatchError(error, errorMessageMapper);
    }
  );
};

export const getSyncOperationRunner = (errorMessageMapper) => (operation) => {
  try {
    return operation();
  } catch (error) {
    throw dispatchError(error, errorMessageMapper);
  }
};
