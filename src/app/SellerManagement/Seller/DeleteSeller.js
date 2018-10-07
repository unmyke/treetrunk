import { Operation } from '../../_lib';
import { equalErrors } from '../../../domain/errors';

equalErrors;

export class DeleteSeller extends Operation {
  static constraints = {
    sellerIdValue: {
      presence: {
        allowEmpty: false,
      },
      uuidv4: true,
    },
  };

  async execute(sellerIdValue) {
    const {
      SUCCESS,
      NOT_FOUND,
      VALIDATION_ERROR,
      NOT_ALLOWED,
      ERROR,
    } = this.outputs;
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
      validate({ sellerIdValue }, { exception: true });

      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);
      seller.delete();
      await sellerRepo.update(seller);

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
      switch (true) {
        case equalErrors(error, errors.sellerNotFound()):
          this.emit(NOT_FOUND, error);
          break;

        case equalErrors(error, errors.transitionNotAllowed()):
          this.emit(NOT_ALLOWED, error);
          break;

        case equalErrors(error, errors.validationError()):
          this.emit(VALIDATION_ERROR, error);
          break;

        default:
          this.emit(ERROR, error);
          break;
      }
    }
  }
}

DeleteSeller.setOutputs([
  'SUCCESS',
  'NOT_FOUND',
  'VALIDATION_ERROR',
  'NOT_ALLOWED',
  'ERROR',
]);
