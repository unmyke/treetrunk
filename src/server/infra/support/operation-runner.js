const dispatchError = (originalError, errorMessageMapper) => {
  const error = errorMessageMapper[originalError.message || originalError.name];

  if (error === undefined) {
    return originalError;
  }

  error.originalError = originalError;
  return error;
};

export const getOperationRunner = (errorMessageMapper) => (operation) => {
  try {
    const res = operation();
    if (res instanceof Promise) {
      res.catch((error) => {
        throw dispatchError(error, errorMessageMapper);
      });
    }
    return res;
  } catch (error) {
    throw dispatchError(error, errorMessageMapper);
  }
};

export const getSyncOperationRunner = getOperationRunner;
export const getAsyncOperationRunner = getOperationRunner;
// export const getSyncOperationRunner = (errorMessageMapper) => (operation) => {
//   try {
//     return operation();
//   } catch (error) {
//     throw dispatchError(error, errorMessageMapper);
//   }
// };

// export const getAsyncOperationRunner = (errorMessageMapper) => (operation) => {
//   return operation().then(
//     (res) => res,
//     (error) => {
//       throw dispatchError(error, errorMessageMapper);
//     }
//   );
// };
