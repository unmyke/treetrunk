import { makeSchema } from 'nexus';
import { resolve } from 'path';

import getSchemaContainer from './get-schema-container';
import resolveContainer from './resolve-container';

const schema = (getServiceName) => {
  const {
    interfaces: interfacesContainer,
    queries: queryContainer,
    typeMutationFields: typeMutationFieldsContainer,
    mutationFields: mutationFieldsContainer,
  } = getSchemaContainer(getServiceName);

  const containers = [
    interfacesContainer,
    queryContainer,
    typeMutationFieldsContainer,
    mutationFieldsContainer,
  ];
  const [
    interfaces,
    queries,
    typeMutationFields,
    mutationFields,
  ] = resolveContainer(containers);

  return makeSchema({
    types: [interfaces, queries, typeMutationFields, mutationFields],
    outputs: { schema: resolve(__dirname, 'schema.graphql') },
  });
};

export default schema;
