export class BaseRepository {
  constructor({
    commonTypes,
    errorFactories: { Persistence: errorFactory },
    mappers: { commonTypes: commonTypesMappers },
  }) {
    this.commonTypes = commonTypes;
    this.errorFactory = errorFactory;
    this.commonTypesMappers = commonTypesMappers;
  }
}
