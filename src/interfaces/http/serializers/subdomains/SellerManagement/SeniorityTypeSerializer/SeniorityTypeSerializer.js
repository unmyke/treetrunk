// import { Serializer } from 'jsonapi-serializer';
import { BaseSerializer } from 'src/domain/_lib';

export class SeniorityTypeSerializer extends BaseSerializer {
  serialize(seniorityType) {
    const {
      SeniorityTypeId: { serialize: serializeSeniorityTypeId },
      Day: { serialize: serializeDay },
    } = this.commonTypes;
    const { seniorityTypeId, name, award, state } = seniorityType;

    const awards = seniorityType.awards.map(({ value, day }) => ({
      value,
      day: serializeDay(day),
    }));

    return {
      id: serializeSeniorityTypeId(seniorityTypeId),
      name,
      award: award,
      state,
      awards,
    };
  }
}
