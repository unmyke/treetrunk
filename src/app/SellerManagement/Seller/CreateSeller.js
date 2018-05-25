import { Operation } from '../../_lib';

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
      format: /^[0-9 \-\+\(\)]+$/,
    },
  };

  async execute({ firstName, middleName, lastName, phone }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR, ALREADY_EXISTS } = this.outputs;
    const {
      repositories: { Seller: sellerRepo },
      entities: { Seller },
      validate,
    } = this;

    try {
      validate({ firstName, middleName, lastName, phone }, { exception: true });

      const seller = new Seller({ firstName, middleName, lastName, phone });

      const newSeller = await sellerRepo.add(seller);

      this.emit(SUCCESS, newSeller.toJSON());
    } catch (error) {
      switch (error.code) {
        case 'ALREADY_EXISTS':
          this.emit(ALREADY_EXISTS, error);
          break;
        case 'INVALID_VALUE':
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
