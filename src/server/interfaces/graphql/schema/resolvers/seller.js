const sellerResolver = (_, { id }, { getSeller }) =>
  new Promise((resolve, reject) => {
    if (!id) {
      return resolve(null);
    }

    const { SUCCESS, ERROR, NOT_FOUND } = getSeller.outputs;

    getSeller.on(SUCCESS, (seller) => resolve(seller));
    getSeller.on(NOT_FOUND, (error) => reject(error));
    getSeller.on(ERROR, (error) => reject(error));

    getSeller.execute(id);
  });

export default sellerResolver;
