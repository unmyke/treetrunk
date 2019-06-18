import { extendType } from 'nexus';

const rootTypeMutations = new Map();

const getRootTypeMutation = (type) => {
  if (rootTypeMutations.has(type)) return rootTypeMutations.get(type);

  const rootTypeMutationName = `${type.name}Mutation`;
  const rootTypeMutation = extendType(rootTypeMutationName, {});
};
