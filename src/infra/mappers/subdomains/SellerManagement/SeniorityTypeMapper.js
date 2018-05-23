import { BaseMapper } from '../../_lib';
import {
  SeniorityTypeId as SeniorityTypeIdMapper,
  Day as DayMapper,
} from '../../commonTypes';

export class SeniorityTypeMapper extends BaseMapper {
  constructor({ commonTypes, Entity }) {
    super({ commonTypes, Entity });
    this.seniorityTypeIdMapper = new SeniorityTypeIdMapper({ commonTypes });
    this.dayMapper = new DayMapper({ commonTypes });
  }

  toDatabase({ seniorityTypeId, name, months, awards }) {
    return {
      seniorityTypeId: this.seniorityTypeIdMapper.toDatabase(seniorityTypeId),
      name,
      months,
      awards: awards.map(({ value, day }) => ({
        value,
        date: this.dayMapper.toDatabase(day),
      })),
    };
  }

  toEntity({ seniorityTypeId, name, months, awards }) {
    const seniorityTypeEntity = new this.Entity({
      seniorityTypeId: this.seniorityTypeIdMapper.toEntity({
        value: seniorityTypeId,
      }),
      name,
      months,
    });

    seniorityTypeEntity.setAwards(
      awards.map(({ value, date }) => ({
        value,
        day: this.dayMapper.toEntity({ value: date }),
      }))
    );
    return seniorityTypeEntity;
  }
}
