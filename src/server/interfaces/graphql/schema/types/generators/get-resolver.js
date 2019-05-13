import * as argsParsers from './args-parsers';

const getResolver = (
  { name: typeName },
  { name: crudName, getOperationName }
) => {
  const operationName = getOperationName(typeName);

  return (_, args, { services: { [operationName]: service }, errors }) =>
    service(...argsParsers[crudName](args, errors));
};

export default getResolver;
