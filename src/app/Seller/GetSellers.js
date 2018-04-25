import { Operation } from '../_lib/Operation';

export class GetSellers extends Operation {
  async execute({ options }) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      domainServices: { Seller: sellerManagementService },
    } = this;

    try {
      const sellers = await sellerRepo.getAll(options);
      const seniorityTypes = seniorityTypeRepo.getAll();

      const sellersDTO = sellers.map((seller) => {
        const {
          sellerId: { value: sellerId },
          fullName,
          seniority,
          recruitDay: { value: recruitDate },
        } = seller;

        const post = postRepo.getById(seller.getPostIdAt());
        const { name, currentPieceRate } = post;

        const { currentAward } = sellerManagementService.getSellerSeniorityType(
          seller,
          seniorityTypes
        );

        const sellerDTO = {
          sellerId,
          fullName,
          name,
          seniority,
          currentPieceRate,
          recruitDate,
          currentAward,
        };
      });

      this.emit(SUCCESS, sellersDTO);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSellers.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
