import uuidv4 from 'uuid/v4';

const getSeniorityTypeData = (chance) => {
  const seniorityTypeId = uuidv4();
  const name = chance.word();
  const createdAt = new Date('2018-01-01');
  const state = 'active';

  const seniorityTypeData = {
    seniorityTypeId,
    name,
    // months,
    // awards,
    createdAt,
    state,
  };
  return seniorityTypeData;
};

export default getSeniorityTypeData;
