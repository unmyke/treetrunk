import { BaseService } from '../../_lib';
import { Day, SellerId } from '../../commonTypes';

export class SellerService extends BaseService {
  getSellersByQuery(query) {
    return this.repositories.Seller.find(query).then((sellers) =>
      Promise.all([Promise.resolve(sellers), ...this.getIncluded(sellers)])
    );
  }

  getSellerById(sellerIdValue) {
    const sellerId = new SellerId({ value: sellerIdValue });

    return this.repositories.Seller.getById(sellerId).then((seller) =>
      Promise.all([Promise.resolve(seller), ...this.getIncluded([seller])])
    );
  }

  getIncluded(sellers) {
    const { allPostIds, monthsBetween } = sellers.reduce(
      ({ allPostIds, monthsBetween: { min, max } }, { months, postIds }) => {
        const newPostIds = [...allPostIds, ...postIds];

        const newMin = min === undefined || months < min ? months : min;
        const newMax = max === undefined || months > max ? months : max;

        const newMonthsBetween = {
          min: newMin,
          max: newMax,
        };

        return { allPostIds: newPostIds, monthsBetween: newMonthsBetween };
      },
      { allPostIds: [], monthsBetween: {} }
    );

    return Promise.all([
      this.repositories.Post.find({ postIds: [...new Set(allPostIds)] }),
      this.repositories.SeniorityType.find({ monthsBetween }),
    ]).then(([posts, seniorityTypes]) => ({ posts, seniorityTypes }));
  }
}
