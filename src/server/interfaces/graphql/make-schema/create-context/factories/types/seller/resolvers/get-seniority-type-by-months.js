const getSeniorityTypeByMonths = () => (
  { seniority },
  _,
  {
    dataSources: {
      services: { getSeniorityTypeByMonths },
    },
    serializers: { SeniorityType: seniorityTypeSerializer },
  }
) =>
  seniority
    ? getSeniorityTypeByMonths(seniority).then(seniorityTypeSerializer)
    : null;

export default getSeniorityTypeByMonths;
