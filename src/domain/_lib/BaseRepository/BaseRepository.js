export class BaseRepository {
  constructor({ Model, models, mapper, mappers, errors }) {
    this.Model = Model;
    this.models = models;
    this.mapper = mapper;
    this.mappers = mappers;
    this.errors = errors;
  }
}
