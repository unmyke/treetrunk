import getMutation from './get-mutation';
import mutations from './mutations';

const getMutations = (type, args) =>
  Object.keys(mutations).reduce(
    (prevMutationFileds, mutationKey) => ({
      ...prevMutationFileds,
      ...getMutation({
        type,
        operation: mutations[mutationKey],
        args: args[mutations[mutationKey].name],
      }),
    }),
    {}
  );

export default getMutations;
