export const nullify = (obj) => {
  const attrs = Object.keys(obj);

  const getNewValue = (value) => {
    switch (true) {
      case value === undefined:
        return null;
      case Array.isArray(value):
        return value.map(nullify);
      case value instanceof Object:
        return nullify(value);
      default:
        return value;
    }
  };

  return attrs.reduce(
    (newObj, attr) => ({ ...newObj, [attr]: getNewValue(obj[attr]) }),
    {}
  );
};
