import { BaseService } from '../_lib/BaseClasses';
import { Day } from '../_lib/ValueObjects';

export class SellerManagementService extends BaseService {
  getSellerPost(seller, posts) {
    if (!posts) {
      return [];
    }
    const postId = seller.getPostIdAt();
    const post = posts.find((p) => p.postId.equals(postId));
  }

  getSellerSeniorityType(seller, seniorityTypes) {
    if (seniorityTypes.length === 0) {
      return;
    }

    const seniority = seller.seniorityAt();
    const [firstSeniorityType, ...restSeniorityTypes] = seniorityTypes;

    return restSeniorityTypes.reduce((acc, seniorityType) => {
      return seniority - seniorityType.month > 0 &&
        seniority - seniorityType.month > seniority - acc.month
        ? acc
        : seniorityType;
    }, firstSeniorityType);
  }
  getSellerWorkshifts(seller) {}
}
