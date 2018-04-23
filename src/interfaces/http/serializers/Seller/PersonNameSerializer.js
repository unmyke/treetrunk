export const PersonNameSerializer = {
  serialize: ({ surname, firstName, middleName }) => {
    return {
      surname,
      firstName,
      middleName
    };
  }
};
