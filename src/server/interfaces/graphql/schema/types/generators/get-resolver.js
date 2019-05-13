import * as argsParsers from './args-parsers';

const getResolver = (
  { name: typeName },
  { name: crudName, getOperationName }
) => (_, args, ctx) => {
  const operationName = getOperationName(typeName);

  const { services, errors } = ctx;
  const { [operationName]: service } = services;

  const result = service(...argsParsers[crudName](args, errors));

  return result;
};

export default getResolver;
