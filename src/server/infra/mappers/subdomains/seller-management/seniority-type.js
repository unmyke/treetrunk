import {
  SeniorityTypeId as SeniorityTypeIdMapper,
  Day as DayMapper,
} from '../../common-types';

const SeniorityTypeMapper = ({ commonTypes, Entity }) => {
  const seniorityTypeIdMapper = SeniorityTypeIdMapper({ commonTypes });
  const dayMapper = DayMapper({ commonTypes });

  const toDatabase = ({ seniorityTypeId, name, months, state, awards }) => {
    return {
      seniorityTypeId: seniorityTypeIdMapper.toDatabase(seniorityTypeId),
      name,
      months,
      state,
      awards: awards.map(({ value, day }) => ({
        value,
        day: dayMapper.toDatabase(day),
      })),
    };
  };

  const toEntity = ({ seniorityTypeId, name, months, state, awards }) => {
    return Entity.restore({
      seniorityTypeId: seniorityTypeIdMapper.toEntity(seniorityTypeId),
      name,
      months,
      state,
      awards: awards.map(({ value, day }) => ({
        value,
        day: dayMapper.toEntity({ value: day }),
      })),
    });
  };

  return Object.freeze({
    toEntity,
    toDatabase,
  });
};

export default SeniorityTypeMapper;
