import getFieldsToTypeMutationFactory from './get-fields-to-type-mutation-factory';

import * as Seller from './seller';
import * as Post from './post';
import * as SeniorityType from './seniority-type';

const mutations = {
  Seller,
  Post,
  SeniorityType,
};

const typeMutationFields = Object.entries(mutations).reduce(
  (prevMutationFiels, [typeName, mutations]) => {
    const mutationFields = getFieldsToTypeMutationFactory(typeName, mutations);

    return {
      ...prevMutationFiels,
      ...mutationFields,
    };
  },
  {}
);
export default typeMutationFields;
