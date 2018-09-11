export const containerMiddleware = (container) => (req, res, next) => {
  req.container = container;
  next();
};

export const injectSerializer = (serializerName) => (req, res, next) => {
  req[serializerName] = req.container.serializers[serializerName];
  next();
};

export const injectOperation = (SubdomainName, EntityName, serviceName) => (
  req,
  res,
  next
) => {
  req[serviceName] = req.container.services[SubdomainName][EntityName][
    serviceName
  ]();
  next();
};
