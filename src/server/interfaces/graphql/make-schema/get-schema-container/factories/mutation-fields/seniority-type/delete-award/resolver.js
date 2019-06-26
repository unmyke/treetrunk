const deleteAward = (
  _,
  { id, day },
  {
    dataSources: {
      services: { deleteSeniorityTypeAward },
    },
    serializers: { SeniorityType: seniorityTypeSerializer },
  }
) => deleteSeniorityTypeAward(id, day).then(seniorityTypeSerializer);

export default deleteAward;
