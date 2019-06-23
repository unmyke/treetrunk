import { lowerFirst } from 'lodash/fp';
import { objectType, extendType } from 'nexus';

const getTypeMutationFactory = (ctx) => {
  const {
    types: { Mutation },
  } = ctx;

  return (typeName) => {
    const typeMutationName = lowerFirst(typeName);
    return extendType({
      type: Mutation,
      definition: (t) => {
        t.field(typeMutationName, {
          type: objectType({
            name: typeMutationName,
            definition: () => {},
          }),
        });
      },
    });
  };
};
export default getTypeMutationFactory;
