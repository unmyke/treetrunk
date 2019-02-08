import { snakeCase } from 'lodash';
import mapperTypes from './mapper-types';

const { OBJECT, ARRAY } = mapperTypes;

const getResorceAttibutes = (mapper) => {
  const mapperAttrs = Object.keys(mapper);

  return mapperAttrs.reduce(
    ({ attributes, ...restOpts }, mapperAttrName) => {
      const newAttrName =
        mapper[mapperAttrName].attrName !== undefined
          ? mapper[mapperAttrName].attrName
          : snakeCase(mapperAttrName);

      const value = mapper[mapperAttrName];
      const newAttributes = [...attributes, newAttrName];

      if (value.type === OBJECT || value.type === ARRAY) {
        restOpts[newAttrName] = getResorceAttibutes(value.serialize);
      }

      return { attributes: newAttributes, ...restOpts };
    },
    { attributes: [] }
  );
};

export default getResorceAttibutes;
