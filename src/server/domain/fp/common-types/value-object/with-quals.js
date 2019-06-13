const withEquals = (ValueObject) => (ValueFactory) => (...args) => {
  const valueObject = ValueObject(ValueFactory)(...args);
  const equals = (value) =>
    value.type &&
    valueObject.type &&
    valueObject.type === value.type &&
    valueObject.valueOf() === value.valueOf();

  return Object.freeze({
    equals,
    ...valueObject,
  });
};
export default withEquals;
