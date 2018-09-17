export const containerMiddleware = (container) => (req, res, next) => {
  req.container = container;
  next();
};

export const injectSerializer = (SubdomainName, EntityName, serializerName) => (
  req,
  res,
  next
) => {
  req[serializerName] =
    req.container.serializers[SubdomainName][EntityName][serializerName];
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
