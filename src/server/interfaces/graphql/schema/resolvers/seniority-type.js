const seniorityTypeResolver = (_, { id }, { getSeniority }) =>
  new Promise((resolve, reject) => {
    const { SUCCESS, NOT_FOUND, ERROR } = getSeniority.outputs;

    getSeniority.on(SUCCESS, (seniorityType) => resolve(seniorityType));
    getSeniority.on(NOT_FOUND, (error) => reject(error));
    getSeniority.on(ERROR, (error) => reject(error));

    getSeniority.execute(id);
  });

const byMonths = (_, { months }, { getSeniorityByMonths }) =>
  new Promise((resolve, reject) => {
    const { SUCCESS, NOT_FOUND, ERROR } = getSeniorityByMonths.outputs;

    getSeniorityByMonths.on(SUCCESS, (seniorityType) => resolve(seniorityType));
    getSeniorityByMonths.on(NOT_FOUND, (error) => reject(error));
    getSeniorityByMonths.on(ERROR, (error) => reject(error));

    getSeniorityByMonths.execute(months);
  });

export default seniorityTypeResolver;
export { byMonths };
