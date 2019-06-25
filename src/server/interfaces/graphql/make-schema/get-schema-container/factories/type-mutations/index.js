import getFieldsToTypeMutationFactory from './get-fields-to-type-mutation-factory';

import * as Seller from './seller';
import * as Post from './post';
import * as SeniorityType from './seniority-type';

const typesMutations = {
  // Seller,
  Post,
  // SeniorityType,
};

const typeMutationFields = Object.entries(typesMutations).reduce(
  (prevMutationFiels, [typeName, typeMutationFields]) => {
    const mutationFields = getFieldsToTypeMutationFactory(
      typeName,
      typeMutationFields
    );

    return {
      ...prevMutationFiels,
      ...mutationFields,
    };
  },
  {}
);
export default typeMutationFields;
