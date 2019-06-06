import contexts from './contexts';

const sellerContexts = (ctx) => {
  describe('seller', () => {
    contexts.forEach((sellerQueryContext) => {
      sellerQueryContext(ctx);
    });
  });
};
export default sellerContexts;
