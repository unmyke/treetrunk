import parseConnectionInput from './parse-connection-input';

const getListResolver = (operationName) => (
  _,
  args,
  { [operationName]: getListOperation }
) =>
  new Promise((resolve, reject) => {
    const { skip, type, id, count, filter, sort } = parseConnectionInput(args);

    const { SUCCESS, ERROR, VALIDATION_ERROR } = getListOperation.outputs;

    getListOperation
      .on(SUCCESS, resolve)
      .on(ERROR, reject)
      .on(VALIDATION_ERROR, reject);

    getListOperation.execute({
      skip,
      type,
      id,
      count,
      filter,
      sort,
    });
  });

export default getListResolver;
