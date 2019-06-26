const createAward = (
  _,
  { id, award: { value, day } },
  {
    dataSources: {
      services: { createSeniorityTypeAward },
    },
    serializers: { SeniorityType: seniorityTypeSerializer },
  }
) => createSeniorityTypeAward(id, { value, day }).then(seniorityTypeSerializer);

export default createAward;
