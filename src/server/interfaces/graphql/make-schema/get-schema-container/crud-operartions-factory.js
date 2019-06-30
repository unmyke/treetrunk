const crudOperartionsFactory = (ctx) => {
  const { cruds, utils: getCrudsOperation } = ctx;

  return Object.entries(cruds).reduce(
    (prevCrudOperations, [typeName, cruds]) => ({
      ...prevCrudOperations,
      ...getCrudsOperation({ typeName, cruds }),
    }),
    {}
  );
};
