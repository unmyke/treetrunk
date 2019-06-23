import getFieldsToTypeMutationFactory from './get-fields-to-type-mutation-factory';

import * as Seller from './seller';
import * as Post from './post';
import * as SeniorityType from './seniority-type';

const mutations = {
  Seller,
  Post,
  SeniorityType,
};

const typeMutations = Object.entries(mutations).reduce(
  (prevMutations, [typeName, typeMutations]) => {
    const getTypeMutationFields = getFieldsToTypeMutationFactory(
      typeName,
      typeMutations
    );

    return {
      ...prevMutations,
      ...getTypeMutationFields,
    };
  },
  {}
);
export default typeMutations;
