const sellerResolver = (_, { id }, { getSeller }) =>
  new Promise((resolve, reject) => {
    const { SUCCESS, ERROR, NOT_FOUND } = getSeller.outputs;

    getSeller
      .on(SUCCESS, (seller) => resolve(seller))
      .on(NOT_FOUND, (error) => reject(error))
      .on(ERROR, (error) => reject(error));

    getSeller.execute(id);
  });

export default sellerResolver;
