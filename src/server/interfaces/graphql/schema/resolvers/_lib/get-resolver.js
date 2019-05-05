const getResolver = (typeName) => (_, { id }, { services, serializers }) =>
  new Promise((resolve, reject) => {
    const {
      SUCCESS,
      ERROR,
      NOT_FOUND,
      VALIDATION_ERROR,
    } = getOperation.outputs;

    getOperation
      .on(SUCCESS, (entity) => {
        const serializedSeller = serializers[typeName](entity);
        resolve(serializedSeller);
      })
      .on(VALIDATION_ERROR, (error) => reject(error))
      .on(NOT_FOUND, (error) => reject(error))
      .on(ERROR, (error) => reject(error));

    getOperation.execute(id);
  });

export default getResolver;
