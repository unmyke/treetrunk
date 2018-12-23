import { BaseSerializer } from '../../_lib';

export class SellerManagementBaseSerializer extends BaseSerializer {
  constructor(opts) {
    super({ ...opts, subdomainResourceName: 'seller_management' });
  }
}
