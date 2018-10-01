import { BaseDeserializer } from '../../_lib';

export class SellerManagementBaseDeserializer extends BaseDeserializer {
  constructor(opts) {
    super({ ...opts, subdomainResourceName: 'seller_management' });
  }
}
