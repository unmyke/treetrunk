import * as argsParsers from '../args-parsers';
import getSerializerName from './get-serializer-name';

const makeGetResolver = (getServiceName) => ({ type, crudName }) => {
  const serilizerName = getSerializerName({ type, crudName });
  const serviceName = getServiceName(type.name, crudName);

  return (
    _,
    args,
    {
      services: { [serviceName]: service },
      serializers: { [serilizerName]: serialize },
      errors,
    }
  ) => service(...argsParsers[crudName](args, errors)).then(serialize);
};

export default makeGetResolver;
