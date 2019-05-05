import { BaseService } from '../../_lib';
import { SellerId } from '../../common-types';

const listToObject = ({ key, list }) =>
  list.reduce(
    (prevList, item) => ({
      ...prevList,
      [item[key]]: item,
    }),
    {}
  );

export default class SellerService extends BaseService {
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

  getIncluded(...sellers) {
    const { allPostIds, monthsBetween } = sellers.reduce(
      ({ allPostIds, monthsBetween: { min, max } }, { seniority, postIds }) => {
        const newPostIds = [...allPostIds, ...postIds];

        const newMin = min === undefined || seniority < min ? seniority : min;
        const newMax = max === undefined || seniority > max ? seniority : max;

        const newMonthsBetween = {
          min: newMin,
          max: newMax,
        };

        return { allPostIds: newPostIds, monthsBetween: newMonthsBetween };
      },
      { allPostIds: [], monthsBetween: {} }
    );

    return Promise.all([
      this.repositories.Post.getByIds([...new Set(allPostIds)]),
      this.repositories.SeniorityType.getAllBetweenMonths(monthsBetween),
    ]).then(([posts, seniorityTypes]) => ({
      posts: listToObject({ key: 'postId', list: posts }),
      seniorityTypes: listToObject({
        key: 'seniorityTypeId',
        list: seniorityTypes,
      }),
    }));
  }
}
