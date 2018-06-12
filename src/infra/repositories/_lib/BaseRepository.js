export class BaseRepository {
  constructor({ commonTypes, errors, commonTypesMappers, entityMapper }) {
    this.commonTypes = commonTypes;
    this.errors = errors;
    this.commonTypesMappers = commonTypesMappers;
    this.entityMapper = entityMapper;
  }
}
