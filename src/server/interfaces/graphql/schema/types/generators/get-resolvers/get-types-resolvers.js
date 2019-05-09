import pluralize from 'pluralize';
import getResolver from './get-resolver';
import getListResolver from './get-list-resolver';

const getTypesResolvers = (types) =>
  Object.keys(types).reduce((prevResolvers, typeName) => {
    const getTypeKey = `get${typeName}`;
    const getTypeListKey = `get${typeName}s`;

    const typeResolver = getResolver(getTypeKey);
    const typeListResolver = getListResolver(getTypeListKey);

    return {
      ...prevResolvers,
      [getTypeKey]: typeResolver,
      [pluralize(getTypeListKey)]: typeListResolver,
    };
  }, {});

export default getTypesResolvers;
