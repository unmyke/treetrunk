import { objectType } from 'nexus';
import getTypeMutationName from './get-type-mutation-name';

const getTypeMutation = () => {
  const typeMutations = new Map();

  // return ({ name: typeName}) => {
  return (typeName) => {
    if (typeMutations.get(typeName)) return typeMutations.get(typeName);

    const typeMutationName = getTypeMutationName(typeName);
    const typeMutation = objectType({
      name: typeMutationName,
      definition: () => {},
    });
    typeMutations.set(typeName, typeMutation);

    return typeMutation;
  };
};
export default getTypeMutation;
