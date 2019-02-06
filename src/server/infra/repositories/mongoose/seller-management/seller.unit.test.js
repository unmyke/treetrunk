import SellerRepository from './seller';
import * as models from '../../../database/models';

const modelName = 'Seller';

describe('SellerRepository', () => {
  const sellerRepo = new SellerRepository({ mappers, models, modelName });
});
