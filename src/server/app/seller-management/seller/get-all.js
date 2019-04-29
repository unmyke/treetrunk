import Operation from '../../operation';
import { Seller as states } from '../../../domain/states';

export default class GetAllSellers extends Operation {
  static constraints = {
    states: { inclusion: states },
    search: {
      notEmpty: true,
    },
  };

  async execute(query = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      entities: { SellerService },
      validate,
    } = this;

    const sellerService = new SellerService({
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
    });

    try {
      validate(query);

      const sellers = await sellerRepo.find(query);
      const { posts, seniorityTypes } = await sellerService.getIncluded(
        ...sellers
      );

      return this.emit(SUCCESS, { sellers, posts, seniorityTypes });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      return this.emit(ERROR, error);
    }
  }
}

GetAllSellers.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
