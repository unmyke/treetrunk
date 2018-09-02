import { Operation } from '../../_lib';
import { Seller as states } from '../../../domain/states';

export class GetAllSellers extends Operation {
  static constraints = {
    state: { inclusion: states },
    first_name: {},
  };

  async execute(query = {}) {
    const { SUCCESS, ERROR, VALIDATION_ERROR } = this.outputs;
    const {
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      entities: { SellerService },
    } = this;

    try {
      const sellers = await sellerRepo.find(query);
      // const seniorityTypes = await seniorityTypeRepo.find({
      //   sellers: sellers.map(({ sellerId }) => sellerId),
      // });
      // const postIds = [
      //   ...sellers.reduce(
      //     (postIdsSet, seller) => new Set([...postIdsSet, ...seller.postIds]),
      //     new Set()
      //   ),
      // ];
      // const posts = await postRepo.getByIds(postIds);

      // const sellersDTO = sellers.map(async (seller) => {
      //   const {
      //     sellerId: { value: sellerId },
      //     fullName,
      //     seniority,
      //     recruitDay: { value: recruitDate },
      //   } = seller;

      //   const sellerDTO = {
      //     sellerId,
      //     fullName,
      //     seniority,
      //     recruitDate,
      //   };

      //   const postId = seller.getPostIdAt();
      //   const { name, pieceRate } = sellerService.getSellerPost(seller, posts);

      //   sellerDTO.postName = name;
      //   sellerDTO.pieceRate = pieceRate;

      //   const sellerService = new SellerService();

      //   const seniorityType = sellerService.getSellerSeniorityType(
      //     seller,
      //     seniorityTypes
      //   );

      //   sellerDTO.award = seniorityType ? seniorityType.award : undefined;

      //   return sellerDTO;
      // });

      this.emit(SUCCESS, sellers);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetAllSellers.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);
