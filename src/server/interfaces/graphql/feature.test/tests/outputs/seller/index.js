import * as contexts from './contexts';

const sellerContexts = (ctx) => {
  describe('seller', () => {
    Object.values(contexts).forEach((sellerQueryContext) => {
      sellerQueryContext(ctx);
    });
  });
};
export default sellerContexts;
