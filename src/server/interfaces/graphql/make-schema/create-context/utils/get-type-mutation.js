import { lowerFirst } from 'lodash/fp';
import { mutationField, objectType } from 'nexus';

const getTypeMutation = ({ name }) =>
  mutationField(lowerFirst(name), {
    type: objectType(),
  });

const typeMutationField = '{name}Mutations';
const typeMutationsType = objectType(typeMutationField, {});
