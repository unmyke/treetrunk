export class BaseRepository {
  constructor({
    domain: {
      entities,
      commonTypes,
      errorFactories: { Persistence: persistenceErrorFactory },
    },
    mappers: { commonTypes: commonTypesMappers, entities: entitiesMappers },
  }) {
    this.entities = entities;
    this.commonTypes = commonTypes;
    this.persistenceErrorFactory = persistenceErrorFactory;
    this.commonTypesMappers = commonTypesMappers;
    this.entitiesMappers = entitiesMappers;
  }
}
