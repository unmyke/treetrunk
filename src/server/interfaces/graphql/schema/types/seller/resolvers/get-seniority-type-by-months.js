const getSeniorityTypeByMonths = (
  { seniority },
  _,
  {
    services: { getSeniorityTypeByMonths },
    serializers: { SeniorityType: seniorityTypeSerializer },
  }
) =>
  getSeniorityTypeByMonths(seniority).then((seniorityType) => {
    return seniorityType ? seniorityTypeSerializer(seniorityType) : null;
  });

export default getSeniorityTypeByMonths;
