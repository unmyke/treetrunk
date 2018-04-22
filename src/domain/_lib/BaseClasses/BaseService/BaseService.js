export class BaseService {
  constructor({ repositories, adapters }) {
    this.repositories = repositories;
    this.adapters = adapters;    
  }
}
