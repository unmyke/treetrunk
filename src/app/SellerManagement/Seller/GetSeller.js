import { SellerManagementOperation } from '../SellerManagementOperation';

export class GetSeller extends SellerManagementOperation {
  async execute(sellerIdValue) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;
    const {
      commonTypes: { SellerId },
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        // Shop: shopRepo,
        // Workshift: workshiftRepo,
      },
    } = this;

    try {
      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);
      const sellerDTO = {
        sellerId: sellerIdValue,
        lastName: seller.personName.lastName,
        firstName: seller.personName.firstName,
        middleName: seller.personName.middleName,
      };

      const appointmentsDTO = seller.appointments.map(
        async ({ postId, day }) => {
          const { name: postName } = await postRepo.getById(postId.value);
          return {
            postId: postId.value,
            postName,
            date: day.value,
          };
        }
      );
      sellerDTO.appointments = appointmentsDTO;

      // const workshifts = workshiftRepo.getBySellerId(sellerId);
      // const workshiftsDTO = workshifts.map((workshift) => {
      //   const shop = shopRepo.getById(workshift.shopId);
      //   const workshiftType = workshiftTypeRepo.getById(
      //     workshift.workshiftTypeId
      //   );
      //   return {
      //     workshiftId: workshiftId.value,
      //     shopAddress: shop.address,
      //     hours: workshift.getHoursBySellerId(sellerId),
      //   };
      // });

      // sellerDTO.workshifts = workshiftsDTO;

      this.emit(SUCCESS, sellerDTO);
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSeller.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);
