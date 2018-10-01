import { BaseService } from '../../_lib';
import { Day } from '../../commonTypes';

export class SellerService extends BaseService {
  getMonthsRangeQuery(sellers) {
    const range = sellers.reduce(({ min, max }, { months }) => {
      const newMin = min === undefined || months < min ? months : min;
      const newMax = max === undefined || months > max ? months : max;

      return {
        min: newMin,
        max: newMax,
      };
    }, {});

    return this.repositories.SeniorityType.find({ monthsBetween: range });
  }

  getPostIdsQuery(sellers) {
    const postIds = new Set(
      sellers.reduce(
        (allPostIds, { postIds }) => [...allPostIds, ...postIds],
        []
      )
    );

    return this.repositories.Post.find({ postIds: [...postIds] });
  }
}
