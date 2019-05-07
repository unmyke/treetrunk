import Operation from '../../operation';
import { isEqualErrors } from '../../../domain/errors';

export default class CreateSeller extends Operation {
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

  async execute(sellerInput) {
    const { SUCCESS, ERROR, VALIDATION_ERROR, ALREADY_EXISTS } = this.outputs;
    const {
      repositories: { Seller: sellerRepo },
      entities: { Seller },
      validate,
      errors,
    } = this;

    try {
      validate(sellerInput, { exception: true });

      const seller = new Seller(sellerInput);
      const newSeller = await sellerRepo.add(seller);
      this.emit(SUCCESS, newSeller);
    } catch (error) {
      switch (true) {
        case isEqualErrors(error, errors.sellerAlreadyExists()):
          this.emit(ALREADY_EXISTS, error);
          break;

        case isEqualErrors(error, errors.validationError()):
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
