import { Operation } from '../../_lib';
import { Seller as states } from '../../../domain/states';

export class GetAllSellers extends Operation {
  static constraints = {
    states: { inclusion: states },
    search: {},
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
    } = this;

    try {
      const sellers = await sellerRepo.find(query);

      const sellerService = new SellerService({
        repositories: {
          Seller: sellerRepo,
          Post: postRepo,
          SeniorityType: seniorityTypeRepo,
        },
      });

      const [posts, seniorityTypes] = await Promise.all([
        sellerService.getPostIdsQuery(sellers),
        sellerService.getMonthsRangeQuery(sellers),
      ]);

      this.emit(SUCCESS, { sellers, posts, seniorityTypes });
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetAllSellers.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
