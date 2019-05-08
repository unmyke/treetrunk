const getSeniorityTypebyMonthsResolver = (
  { seniority },
  _,
  {
    services: {
      SellerManagement: {
        SeniorityType: { getSeniorityTypeByMonths },
      },
    },
    serializers: { SeniorityType: seniorityTypeSerializer },
  }
) =>
  new Promise((resolve, reject) => {
    const { SUCCESS, NOT_FOUND, ERROR } = getSeniorityTypeByMonths.outputs;

    getSeniorityTypeByMonths.on(SUCCESS, (seniorityType) =>
      resolve(seniorityTypeSerializer(seniorityType))
    );
    getSeniorityTypeByMonths.on(NOT_FOUND, (error) => reject(error));
    getSeniorityTypeByMonths.on(ERROR, (error) => reject(error));

    getSeniorityTypeByMonths.execute(seniority);
  });

export default getSeniorityTypebyMonthsResolver;
