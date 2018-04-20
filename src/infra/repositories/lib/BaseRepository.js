export class BaseRepository {
  constructor({ domain: { entities, commonTypes} }) {
    this.entities = entities;
    this.commonTypes = commonTypes;
  }
}
