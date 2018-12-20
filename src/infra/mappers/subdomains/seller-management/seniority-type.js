import { BaseMapper } from '../../_lib';
import {
  SeniorityTypeId as SeniorityTypeIdMapper,
  Day as DayMapper,
} from '../../common-types';

export class SeniorityTypeMapper extends BaseMapper {
  constructor({ commonTypes, Entity }) {
    super({ commonTypes, Entity });
    this.seniorityTypeIdMapper = new SeniorityTypeIdMapper({ commonTypes });
    this.dayMapper = new DayMapper({ commonTypes });
  }

  toDatabase({ seniorityTypeId, name, months, state, awards }) {
    return {
      seniority_type_id: this.seniorityTypeIdMapper.toDatabase(seniorityTypeId),
      name,
      months,
      state,
      awards: awards.map(({ value, day }) => ({
        value,
        day: this.dayMapper.toDatabase(day),
      })),
    };
  }

  toEntity({ seniority_type_id, name, months, state, awards }) {
    return this.Entity.restore({
      seniorityTypeId: this.seniorityTypeIdMapper.toEntity({
        value: seniority_type_id,
      }),
      name,
      months,
      state,
      awards: awards.map(({ value, day }) => ({
        value,
        day: this.dayMapper.toEntity({ value: day }),
      })),
    });
  }
}
