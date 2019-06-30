import getSerializerName from './get-serializer-name';

const createGetResolver = (getServiceName) => (ctx) => {
  const { argsParsers } = ctx;

  return ({ type: { name: typeName }, crudName }) => {
    const serilizerName = getSerializerName({ typeName, crudName });
    const serviceName = getServiceName(typeName, crudName);

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
