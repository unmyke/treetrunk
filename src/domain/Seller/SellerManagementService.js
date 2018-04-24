import { BaseService } from '../_lib/BaseClasses';
import { Day } from '../_lib/ValueObjects';

export class SellerManagementService extends BaseService {
  getPostAt(sellerId, day = new Day()) {}
}
