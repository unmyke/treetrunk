const idSerializer = {
  toDTO: ({ data: { value: id = null } = {} }) => id,
};

export default idSerializer;
