export class BaseRepository {
  constructor({ Model, models, mapper }) {
    this.Model = Model;
    this.models = models;
    this.mapper = mapper;
  }
}
