const daySerializer = {
  serialize: ({ value = null } = { value: null }) => value,
  parse: (value) => new Date(value),
};

export default daySerializer;
