export class BaseRepository {
  constructor({ commonTypes, errorFactory, commonTypesMappers }) {
    this.commonTypes = commonTypes;
    this.errorFactory = errorFactory;
    this.commonTypesMappers = commonTypesMappers;
  }
}
