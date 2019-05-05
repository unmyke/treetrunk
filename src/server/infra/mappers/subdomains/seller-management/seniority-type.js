import { addTimestamp } from '../../_lib';

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

  const toEntity = ({
    seniorityTypeId,
    name,
    months,
    state,
    awards,
    ...props
  }) => {
    return Entity.restore({
      seniorityTypeId: seniorityTypeIdMapper.toEntity(seniorityTypeId),
      name,
      months,
      state,
      awards: awards.map(({ value, day }) => ({
        value,
        day: dayMapper.toEntity({ value: day }),
      })),
      ...props,
    });
  };

  return Object.freeze({
    toEntity,
    toDatabase,
  });
};

export default addTimestamp(SeniorityTypeMapper);
