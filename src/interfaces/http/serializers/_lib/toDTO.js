import { snakeCase } from 'lodash';
export const mapperTypes = {
  IDENTITY: 'identity',
  CALLBACK: 'callback',
  OBJECT: 'object',
  ARRAY: 'array',
};

export const toDTO = (obj, mapper) => {
  const getNewValue = (value, { type, serialize: mapper }) => {
    switch (type) {
      case mapperTypes.CALLBACK:
        const callbackValue = mapper(value);
        return callbackValue !== undefined ? callbackValue : null;
      case mapperTypes.OBJECT:
        return toDTO(value, mapper);
      case mapperTypes.ARRAY:
        return value.map((value) => toDTO(value, mapper));
      default:
        return value != undefined ? value : null;
    }
  };

  const mapperAttrs = Object.keys(mapper);

  return mapperAttrs.reduce((newObj, mapperAttrName) => {
    const newPropName =
      mapper[mapperAttrName].propName !== undefined
        ? mapper[mapperAttrName].propName
        : snakeCase(mapperAttrName);
    return {
      ...newObj,
      [newPropName]: getNewValue(obj[mapperAttrName], mapper[mapperAttrName]),
    };
  }, {});
};
