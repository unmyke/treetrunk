import getMockService from './get-mock-service';

const getMockServices = (services) =>
  Object.entries(services).reduce(
    (prevServices, [serviceName, service]) => ({
      ...prevServices,
      [serviceName]: getMockService(service),
    }),
    {}
  );
export default getMockServices;
