export class BaseRepository {
  constructor({ Model, models, mapper, errors }) {
    this.Model = Model;
    this.models = models;
    this.mapper = mapper;
    this.errors = errors;
  }
}
