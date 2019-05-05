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
  const serializedAward = awards.map(({ value, day }) => ({
    value,
    day: serializers.day(day),
  }));

  return {
    id: serializers.id(seniorityTypeId),
    name,
    months,
    award,
    awards: serializedAward,
    state,
  };
};

export default timestamp(seniorityTypeSerializer);
