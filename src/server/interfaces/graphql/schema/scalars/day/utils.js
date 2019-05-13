export const serialize = (dateTime) => {
  return dateTime ? dateTime.getTime() : null;
};
export const parse = (value) => new Date(value);
