import { BaseService } from '../_lib/BaseClasses';
import { Day } from '../_lib/ValueObjects';

export class SellerManagementService extends BaseService {
  getSellerById(sellerId) {}
  getSellerPost(seller) {
    return postAdapter.getPost(seller.id);
  }
  getSellerWorkshifts(seller) {}
}
