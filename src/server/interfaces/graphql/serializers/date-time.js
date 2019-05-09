const dateTimeSerializer = {
  parse: (value) => new Date(value),
  serialize: (date) => date.getTime(),
};

export default dateTimeSerializer;
