import { Operation } from '../_lib/Operation';

export class GetSellerById extends Operation {
  async execute({ sellerId: sellerIdValue }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      Seller: sellerManagementService,
      Workshift: workshiftManagementService,
    } = this.domainServices;

    try {
      this.emit(SUCCESS, seller);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

AddSellerAppointment.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
