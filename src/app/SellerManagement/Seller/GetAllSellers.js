import { SellerManagementOperation } from '../SellerManagementOperation';

export class GetAllSellers extends SellerManagementOperation {
  async execute(props = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      services: { SellerManagementService },
    } = this;

    try {
      const sellers = await sellerRepo.getAll(props);
      const seniorityTypes = await seniorityTypeRepo.getAll();
      const postIds = [
        ...sellers.reduce(
          (postIdsSet, seller) => new Set([...postIdsSet, ...seller.postIds]),
          new Set()
        ),
      ];
      const posts = await postRepo.getByIds(postIds);

      const sellersDTO = sellers.map(async (seller) => {
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
        const {
          name,
          currentPieceRate,
        } = sellerManagementService.getSellerPost(seller, posts);

        sellerDTO.postName = name;
        sellerDTO.currentPieceRate = currentPieceRate;

        const sellerManagementService = new SellerManagementService();

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

GetAllSellers.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
