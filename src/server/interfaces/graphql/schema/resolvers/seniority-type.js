export default ({ seniorityId }, _, { getSeniorityById }) =>
  new Promise((resolve, reject) => {
    if (seniorityId) {
      return resolve(null);
    }

    getSeniorityById.on('SUCCESS', (seniorityType) => resolve(seniorityType));
    getSeniorityById.on('NOT_FOUND', (error) => reject(error));
    getSeniorityById.on('ERROR', (error) => reject(error));

    getSeniorityById.execute(seniorityId);
  });
