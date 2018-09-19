export const toDTO = (obj, mapper) => {
  const getNewValue = (value, mapper) => {
    switch (true) {
      case mapper === undefined && value === undefined:
        return null;
      case Array.isArray(mapper):
        return value.map(() => toDTO(value, mapper));
      case value instanceof Object:
        return toDTO(value, mapper);
      default:
        return value;
    }
  };

  console.log(obj);
  console.log(mapper);

  const mapperAttrs = Object.keys(mapper);

  return mapperAttrs.reduce(
    (newObj, mapperAttrName) => ({
      ...newObj,
      [mapper[mapperAttrName].propName]: getNewValue(
        obj[mapperAttrName],
        mapper[mapperAttrName].serialize
      ),
    }),
    {}
  );
};
