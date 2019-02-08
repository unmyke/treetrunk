const mapperTypes = {
  IDENTITY: 'identity',
  ID_GENERATOR: 'igGenerator',
  CALLBACK: 'callback',
  OBJECT: 'object',
  ARRAY: 'array',
  INCLUDED: 'included',
};

export const toDTO = (obj, { mapper, resourceName, config }) => {
  const getNewValue = (
    value,
    parentObj,
    { type, attrName, serialize: mapper }
  ) => {
    switch (type) {
      case mapperTypes.CALLBACK:
        const callbackValue = mapper(value, parentObj, {
          resourceName,
          config,
        });
        return callbackValue !== undefined ? callbackValue : null;
      case mapperTypes.OBJECT:
        return toDTO(value, parentObj, { mapper, config });
      case mapperTypes.INCLUDED:
        const includedEntity = included[attrName].find(
          ({ [`${attrName}Id`]: id }) => value.equals(id)
        );
        return mapper.toDTO({ data: includedEntity, included });
      case mapperTypes.ARRAY:
        return value.map((value, parentObj) =>
          toDTO(value, parentObj, { mapper, config })
        );
      default:
        return value != undefined ? value : null;
    }
  };

  const mapperAttrs = Object.keys(mapper);

  return mapperAttrs.reduce((newObj, mapperAttrName) => {
    const newPropName =
      mapper[mapperAttrName].attrName !== undefined
        ? mapper[mapperAttrName].attrName
        : mapperAttrName;
    return {
      ...newObj,
      [newPropName]: getNewValue(
        obj[mapperAttrName],
        obj,
        mapper[mapperAttrName]
      ),
    };
  }, {});
};

export default mapperTypes;
