const updateAward = (
  _,
  { id, day, newAward: { value: newValue, day: newDay } },
  {
    dataSources: {
      services: { updateSeniorityTypeAward },
    },
    serializers: { SeniorityType: seniorityTypeSerializer },
  }
) =>
  updateSeniorityTypeAward(id, day, { value: newValue, day: newDay }).then(
    seniorityTypeSerializer
  );

export default updateAward;
