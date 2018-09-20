import { snakeCase } from 'lodash';
import { mapperTypes } from './toDTO';
const { OBJECT, ARRAY } = mapperTypes;

export const getResorceAttibutes = (mapper) => {
  const mapperAttrs = Object.keys(mapper);

  return mapperAttrs.reduce(
    ({ attributes }, mapperAttrName) => {
      const newAttrName =
        mapper[mapperAttrName].attrName !== undefined
          ? mapper[mapperAttrName].attrName
          : snakeCase(mapperAttrName);

      const value = mapper[mapperAttrName];

      if (value.type === OBJECT || value.type === ARRAY) {
        return { [newAttrName]: getResorceAttibutes(value) };
      }

      return { attributes: [...attributes, newAttrName] };
    },
    { attributes: [] }
  );
};
