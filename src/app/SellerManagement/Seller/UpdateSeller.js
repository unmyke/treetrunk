import { Operation } from '../../_lib';

export class UpdateSeller extends Operation {
  static constraints = {
    sellerIdValue: {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: '[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}',
        message: '^SellerId: "%{value}" must be UUID',
      },
    },
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
      format: /^[\d \+\-\(\)]+$/,
    },
  };

  async execute({ sellerIdValue, firstName, middleName, lastName, phone }) {
    const {
      SUCCESS,
      VALIDATION_ERROR,
      NOT_FOUND,
      ALREADY_EXISTS,
      NOTHING_TO_UPDATE,
      ERROR,
    } = this.outputs;

    const {
      repositories: { Seller: sellerRepo },
      commonTypes: { SellerId },
      validate,
    } = this;

    try {
      validate(
        { sellerIdValue, firstName, middleName, lastName, phone },
        { exception: true }
      );

      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);

      seller.update({ firstName, middleName, lastName, phone });

      const updatedSeller = await sellerRepo.save(seller);

      this.emit(SUCCESS, updatedSeller.toJSON());
    } catch (error) {
      switch (error.code) {
        case 'INVALID_VALUE':
          return this.emit(VALIDATION_ERROR, error);
        case 'NOT_FOUND':
          return this.emit(NOT_FOUND, error);
        case 'ALREADY_EXISTS':
          return this.emit(ALREADY_EXISTS, error);
        case 'NOTHING_TO_UPDATE':
          return this.emit(NOTHING_TO_UPDATE, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

UpdateSeller.setOutputs([
  'SUCCESS',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'ALREADY_EXISTS',
  'NOTHING_TO_UPDATE',
  'ERROR',
]);
