const getMockService = (service) =>
  jest.fn((opts) => Promise.resolve(service(opts)));
export default getMockService;
