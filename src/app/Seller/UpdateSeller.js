import { Operation } from '../_lib/Operation';

export class UpdateSeller extends Operation {
  async execute({ lastName, firstName, middleName, phone }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: { Seller: sellerRepo },
      entities: { Seller },
      commonTypes: { PostId },
    } = this;

    try {
      const seller = new Seller({ lastName, firstName, middleName, phone });

      const newSeller = await sellerRepo.add(seller);

      this.emit(SUCCESS, newSeller);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

UpdateSeller.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
