import timestamp from './timestamp';
import list from './list';
import id from './id';
import day from './day';

const serializers = { id, day };

const SeniorityType = timestamp(
  ({ seniorityTypeId, name, months, award, awards, state }) => {
    return {
      __type: 'SeniorityType',
      id: serializers.id(seniorityTypeId),
      name,
      months,
      award,
      awards: awards.map(({ value, day }) => ({
        value,
        day: serializers.day(day),
      })),
      state,
    };
  }
);

export default SeniorityType;
export const SeniorityTypes = list(SeniorityType);
