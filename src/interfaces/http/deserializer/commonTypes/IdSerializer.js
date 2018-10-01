export const idSerializer = {
  toDTO: ({ data: { value: id = null } = {} }) => id,
};
