import * as argsParsers from '../args-parsers';
import getSerializerName from './get-serializer-name';

const getResolver = (
  { name: typeName },
  { name: crudName, getOperationName }
) => {
  const operationName = getOperationName(typeName);
  const serilizerName = getSerializerName(typeName, operationName);

  return (
    _,
    args,
    {
      services: { [operationName]: service },
      serializers: { [serilizerName]: serialize },
      errors,
    }
  ) => service(...argsParsers[crudName](args, errors)).then(serialize);
};

export default getResolver;
