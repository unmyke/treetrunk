export class BaseMapper {
  constructor({ domain: { entities, commonTypes } }) {
    this.entities = entities;
    this.commonTypes = commonTypes;
  }
}
