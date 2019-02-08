import Operation from '../../operation';
import { isEqualErrors } from '../../../domain/errors';

export default class UpdateSeller extends Operation {
  static constraints = {
    sellerIdValue: {
      presence: {
        allowEmpty: false,
      },
      uuidv4: true,
    },
    firstName: {
      notEmpty: true,
    },
    middleName: {
      notEmpty: true,
    },
    lastName: {
      notEmpty: true,
    },
    phone: {
      phone: true,
    },
  };

  async execute({
    sellerId: sellerIdValue,
    firstName,
    middleName,
    lastName,
    phone,
  }) {
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      ERROR,
    } = this.outputs;

    const {
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      entities: { SellerService },
      commonTypes: { SellerId },
      validate,
      errors,
    } = this;

    try {
      validate(
        { sellerIdValue, firstName, middleName, lastName, phone },
        { exception: true }
      );

      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);

      seller.update({ firstName, middleName, lastName, phone });

      const updatedSeller = await sellerRepo.update(seller);

      const sellerService = new SellerService({
        repositories: {
          Seller: sellerRepo,
          Post: postRepo,
          SeniorityType: seniorityTypeRepo,
        },
      });

      const [posts, seniorityTypes] = await Promise.all([
        sellerService.getPostIdsQuery([updatedSeller]),
        sellerService.getMonthsRangeQuery([updatedSeller]),
      ]);

      this.emit(SUCCESS, { seller: updatedSeller, posts, seniorityTypes });
    } catch (error) {
      switch (true) {
        case isEqualErrors(error, errors.validationError()):
          this.emit(VALIDATION_ERROR, error);
          break;

        case isEqualErrors(error, errors.sellerAlreadyExists()):
          this.emit(ALREADY_EXISTS, error);
          break;

        case isEqualErrors(error, errors.sellerNotFound()):
          this.emit(NOT_FOUND, error);
          break;

        default:
          this.emit(ERROR, error);
          break;
      }
    }
  }
}

UpdateSeller.setOutputs([
  'SUCCESS',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'ALREADY_EXISTS',
  'ERROR',
]);
