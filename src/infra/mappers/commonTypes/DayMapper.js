import { BaseMapper } from '../_lib';

export class DayMapper extends BaseMapper {
  toDatabase({ value }) {
    return value;
  }

  toEntity({ value }) {
    return new this.commonTypes.Day({ value });
  }
}
