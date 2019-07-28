import { makeSchema } from 'nexus';
import { resolve } from 'path';

import getSchemaContainer from './get-schema-container';
import resolveContainer from './resolve-container';

const schema = (getServiceName) => {
  const {
    interfaces: interfacesContainer,
    typeMutationFields: typeMutationFieldsContainer,
    queryFields: queryFieldsContainer,
    mutationFields: mutationFieldsContainer,
  } = getSchemaContainer(getServiceName);

  const containers = [
    interfacesContainer,
    typeMutationFieldsContainer,
    queryFieldsContainer,
    mutationFieldsContainer,
  ];
  const [
    interfaces,
    typeMutationFields,
    queryFields,
    mutationFields,
  ] = resolveContainer(containers);

  return makeSchema({
    types: [interfaces, queryFields, typeMutationFields, mutationFields],
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
