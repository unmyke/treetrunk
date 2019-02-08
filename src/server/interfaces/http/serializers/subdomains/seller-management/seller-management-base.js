import { BaseSerializer } from '../../_lib';

export default class SellerManagementBaseSerializer extends BaseSerializer {
  constructor(opts) {
    super({ ...opts, subdomainResourceName: 'seller_management' });
  }
}
