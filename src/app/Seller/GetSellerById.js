import { Operation } from '../_lib/Operation';

export class GetSellerById extends Operation {
  async execute({ sellerId: sellerIdValue }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      domain: {
        commonTypes: { SellerId },
      },
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        Shop: shopRepo,
        Workshift: workshiftRepo,
      },
    } = this;

    try {
      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = sellerRepo.getById(sellerId);
      const sellerDTO = {
        sellerId: sellerIdValue,
        surname: seller.personName.surname,
        firstName: seller.personName.firstName,
        middleName: seller.personName.middleName,
      };

      const appointmentsDTO = seller.appointments.map(({ postId, day }) => {
        const { name: postName } = postRepo.getById(postId.value);
        return {
          postId: postId.value,
          postName,
          date: day.value,
        };
      });
      sellerDTO.appointments = appointmentsDTO;

      const workshifts = workshiftRepo.getBySellerId(sellerId);
      const workshiftsDTO = workshifts.map((workshift) => {
        const shop = shopRepo.getById(workshift.shopId);
        const workshiftType = workshiftTypeRepo.getById(
          workshift.workshiftTypeId
        );
        return {
          workshiftId: workshiftId.value,
          shopAddress: shop.address,
          hours: workshift.getHoursBySellerId(sellerId),
        };
      });

      sellerDTO.workshifts = workshiftsDTO;

      this.emit(SUCCESS, sellerDTO);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSellerById.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
