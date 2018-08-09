import { BaseMapper } from '../_lib';

export class DayMapper extends BaseMapper {
  toDatabase(day) {
    return day.toString();
  }

  toEntity({ value }) {
    return new this.commonTypes.Day({ value: new Date(value) });
  }
}
