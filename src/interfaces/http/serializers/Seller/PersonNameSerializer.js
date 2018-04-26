export const PersonNameSerializer = {
  serialize: ({ lastName, firstName, middleName }) => {
    return {
      lastName,
      firstName,
      middleName,
    };
  },
};
