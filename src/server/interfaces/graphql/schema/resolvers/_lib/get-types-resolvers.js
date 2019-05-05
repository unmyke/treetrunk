import getResolver from './get-resolver';
import getListResolver from './get-list-resolver';

const getTypesResolvers = (types) =>
  types.reduce(
    ({ types: prevTypeResolvers, lists: prevTypeListResolvers }, type) => {
      const key = type.toLowerCase();

      return {
        types: {
          ...prevTypeResolvers,
          [key]: getResolver(`get${type}`),
        },
        lists: {
          ...prevTypeListResolvers,
          [key]: getListResolver(`get${type}`),
        },
      };
    },
    { types: {}, lists: {} }
  );

export default getTypesResolvers;
