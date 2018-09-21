import { snakeCase } from 'lodash';
export const mapperTypes = {
  IDENTITY: 'identity',
  CALLBACK: 'callback',
  OBJECT: 'object',
  ARRAY: 'array',
};

export const toDTO = (obj, parentObj, mapper) => {
  const getNewValue = (value, parentObj, { type, serialize: mapper }) => {
    switch (type) {
      case mapperTypes.CALLBACK:
        const callbackValue = mapper(value, parentObj);
        return callbackValue !== undefined ? callbackValue : null;
      case mapperTypes.OBJECT:
        return toDTO(value, parentObj, mapper);
      case mapperTypes.ARRAY:
        return value.map((value, parentObj) => toDTO(value, parentObj, mapper));
      default:
        return value != undefined ? value : null;
    }
  };

  const mapperAttrs = Object.keys(mapper);

  return mapperAttrs.reduce((newObj, mapperAttrName) => {
    const newPropName =
      mapper[mapperAttrName].attrName !== undefined
        ? mapper[mapperAttrName].attrName
        : snakeCase(mapperAttrName);
    // console.log(mapperAttrName);
    // console.log(obj[mapperAttrName]);
    // console.log(mapper[mapperAttrName]);
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
