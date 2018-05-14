import { Operation } from './_lib';

export class SellerManagementOperation extends Operation {
  constructor({
    makeValidator,
    subdomains: {
      SellerManagement: { entities, services: domainServices },
    },
    commonTypes,
    errorFactories,
    repositories: { SellerManagement: repositories },
  }) {
    super({ makeValidator, commonTypes });
    this.entities = entities;
    this.domainServices = domainServices;
    this.repositories = repositories;
  }
}
