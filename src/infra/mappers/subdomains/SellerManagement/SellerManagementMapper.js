import { BaseMapper } from '../../_lib';

export class SellerManagementMapper extends BaseMapper {
  constructor({
    commonTypes,
    subdomains: {
      SellerManagement: { entities },
    },
  }) {
    super({ commonTypes });
    this.entities = entities;
  }
}
