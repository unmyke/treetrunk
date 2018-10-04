import { Operation } from '../../_lib';
import { equalErrors } from '../../../domain/errors';

equalErrors;

export class GetSeller extends Operation {
  static constrains = {
    sellerIdValue: {
      presence: {
        allowEmpty: false,
      },
      format: { pattern: /^[0-9 \-\+\(\)]+$/ },
    },
  };

  async execute(sellerIdValue) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;
    const {
      commonTypes: { SellerId },
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      entities: { SellerService },
      validate,
      errors,
    } = this;

    try {
      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);

      const sellerService = new SellerService({
        repositories: {
          Seller: sellerRepo,
          Post: postRepo,
          SeniorityType: seniorityTypeRepo,
        },
      });

      const [posts, seniorityTypes] = await Promise.all([
        sellerService.getPostIdsQuery([seller]),
        sellerService.getMonthsRangeQuery([seller]),
      ]);

      this.emit(SUCCESS, { seller, posts, seniorityTypes });
    } catch (error) {
      if (equalErrors(error, errors.sellerNotFound())) {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSeller.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);
