export class BaseRepository {
  constructor({ commonTypes, errorFactory, commonTypesMappers, entityMapper }) {
    this.commonTypes = commonTypes;
    this.errorFactory = errorFactory;
    this.commonTypesMappers = commonTypesMappers;
    this.entityMapper = entityMapper;
  }
}
