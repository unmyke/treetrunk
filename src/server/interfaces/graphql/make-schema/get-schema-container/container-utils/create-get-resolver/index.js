import getSerializerName from './get-serializer-name';

const createGetResolver = (getServiceName) => (ctx) => {
  const { argsParsers } = ctx;

  return ({ type, crudName }) => {
    const serilizerName = getSerializerName({ type, crudName });
    const serviceName = getServiceName(type.name, crudName);

    return (
      _,
      args,
      {
        dataSources: {
          services: { [serviceName]: service },
        },
        serializers: { [serilizerName]: serialize },
        errors,
      }
    ) => {
      return service(...argsParsers[crudName](args, errors)).then((res) => {
        return serialize(res);
      });
    };
  };
};

export default createGetResolver;
