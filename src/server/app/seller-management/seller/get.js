import Operation from '../../operation';
import { isEqualErrors } from '../../../domain/errors';

export default class GetSeller extends Operation {
  static constraints = {
    sellerIdValue: {
      presence: {
        allowEmpty: false,
      },
      uuidv4: true,
    },
  };

  async execute(sellerIdValue) {
    const { SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR } = this.outputs;
    const {
      commonTypes: { SellerId },
      repositories: { Seller: sellerRepo },
      validate,
      errors,
    } = this;

    try {
      validate({ sellerIdValue }, { exception: true });

      const sellerId = new SellerId({ value: sellerIdValue });
      const newSeller = await sellerRepo.getById(sellerId);

      // const { posts, seniorityTypes } = await sellerService.getIncluded(
      //   newSeller
      // );

      this.emit(SUCCESS, newSeller);
      // this.emit(SUCCESS, {
      //   seller: newSeller,
      //   posts,
      //   seniorityType: seniorityTypes[0],
      // });
    } catch (error) {
      switch (true) {
        case isEqualErrors(error, errors.sellerNotFound()):
          this.emit(NOT_FOUND, error);
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

GetSeller.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);
