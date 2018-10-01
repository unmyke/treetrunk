import { Operation } from '../../_lib';

export class GetSeller extends Operation {
  async execute(sellerIdValue) {
    const { SUCCESS, ERROR, NOT_FOUND } = this.outputs;
    const {
      commonTypes: { SellerId },
      repositories: {
        Seller: sellerRepo,
        Post: postRepo,
        SeniorityType: seniorityTypeRepo,
      },
      entities: { SellerService },
    } = this;

    try {
      const sellerId = new SellerId({ value: sellerIdValue });
      const seller = await sellerRepo.getById(sellerId);

      const sellerService = new SellerService({
        repositories: {
          Seller: sellerRepo,
          Post: postRepo,
          SeniorityType: seniorityTypeRepo,
        },
      });

      const [posts, seniorityTypes] = await Promise.all([
        sellerService.getPostIdsQuery([seller]),
        sellerService.getMonthsRangeQuery([seller]),
      ]);

      this.emit(SUCCESS, { seller, posts, seniorityTypes });
    } catch (error) {
      if (error.message === 'NOT_FOUND') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

GetSeller.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);
