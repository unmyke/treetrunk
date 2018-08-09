import { BaseMapper } from './BaseMapper';

export class BaseIdMapper extends BaseMapper {
  toDatabase({ value }) {
    return value;
  }

  toEntity({ value }) {
    return new this.commonTypes[this.constructor.EntityIdName]({ value });
  }
}
