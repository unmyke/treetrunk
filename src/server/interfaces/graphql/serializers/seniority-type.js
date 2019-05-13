import id from './id';
import day from './day';
import timestamp from './timestamp';

const serializers = { id, day };

const seniorityTypeSerializer = ({
  seniorityTypeId,
  name,
  months,
  award,
  awards,
  state,
}) => {
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
};

export default timestamp(seniorityTypeSerializer);
