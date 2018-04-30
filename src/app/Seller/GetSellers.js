import { Operation } from '../_lib/Operation';

export class GetSellers extends Operation {
  async execute(props = {}) {
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
      const sellers = await sellerRepo.getAll(props);
      const seniorityTypes = seniorityTypeRepo.getAll();

      const sellersDTO = sellers.map((seller) => {
        const {
          sellerId: { value: sellerId },
          fullName,
          seniority,
          recruitDay: { value: recruitDate },
        } = seller;

        const sellerDTO = {
          sellerId,
          fullName,
          seniority,
          recruitDate,
        };

        const postId = seller.getPostIdAt();

        if (postId) {
          const post = postRepo.getById(seller.getPostIdAt());
          const { name, currentPieceRate } = post;
          sellerDTO.postName = name;
          sellerDTO.currentPieceRate = currentPieceRate;
        }

        const seniorityType = sellerManagementService.getSellerSeniorityType(
          seller,
          seniorityTypes
        );

        sellerDTO.currentAward = seniorityType
          ? seniorityType.currentAward
          : undefined;

        return sellerDTO;
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
