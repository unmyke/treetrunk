export const daySerializer = {
  toDTO: ({ data: { value: day } = {} }) => day && day.value.toString(),
};
