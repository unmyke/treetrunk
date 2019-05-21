import timestamp from './timestamp';

const seniorityTypeMapper = ({ seniorityTypeId, name, months, awards }) => ({
  id: seniorityTypeId,
  name,
  months,
  awards,
});

export default timestamp(seniorityTypeMapper);
