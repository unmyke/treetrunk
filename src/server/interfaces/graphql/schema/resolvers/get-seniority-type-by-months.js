const getSeniorityTypebyMonthsResolver = (
  { seniority },
  _,
  { getSeniorityByMonths }
) =>
  new Promise((resolve, reject) => {
    const { SUCCESS, NOT_FOUND, ERROR } = getSeniorityByMonths.outputs;

    getSeniorityByMonths.on(SUCCESS, (seniorityType) => resolve(seniorityType));
    getSeniorityByMonths.on(NOT_FOUND, (error) => reject(error));
    getSeniorityByMonths.on(ERROR, (error) => reject(error));

    getSeniorityByMonths.execute(seniority);
  });

export default getSeniorityTypebyMonthsResolver;
