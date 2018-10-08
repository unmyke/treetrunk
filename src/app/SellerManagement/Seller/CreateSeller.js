import { Operation } from '../../_lib';
import { equalErrors } from '../../../domain/errors';

export class CreateSeller extends Operation {
  static constraints = {
    firstName: {
      presence: {
        allowEmpty: false,
      },
    },
    middleName: {
      presence: {
        allowEmpty: false,
      },
    },
    lastName: {
      presence: {
        allowEmpty: false,
      },
    },
    phone: {
      presence: {
        allowEmpty: false,
      },
      phone: true,
    },
  };

  async execute(sellerPromise) {
    const { SUCCESS, ERROR, VALIDATION_ERROR, ALREADY_EXISTS } = this.outputs;
    const {
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      entities: { Seller, SellerService },
      validate,
      errors,
    } = this;

    const sellerService = new SellerService({
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
    });

    const { firstName, middleName, lastName, phone } = await sellerPromise;

    try {
      validate({ firstName, middleName, lastName, phone }, { exception: true });

      const seller = new Seller({ firstName, middleName, lastName, phone });
      const newSeller = await sellerRepo.add(seller);
      const { posts, seniorityTypes } = await sellerService.getIncluded([
        newSeller,
      ]);

      this.emit(SUCCESS, { seller: newSeller, posts, seniorityTypes });
    } catch (error) {
      switch (true) {
        case equalErrors(error, errors.sellerAlreadyExists()):
          this.emit(ALREADY_EXISTS, error);
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

CreateSeller.setOutputs([
  'SUCCESS',
  'ERROR',
  'VALIDATION_ERROR',
  'ALREADY_EXISTS',
]);
