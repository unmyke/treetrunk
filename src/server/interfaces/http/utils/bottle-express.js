export const containerMiddleware = (container) => (req, res, next) => {
  req.container = container;
  next();
};

export const injectSerializer = (SubdomainName, EntityName) => (
  req,
  res,
  next
) => {
  req.serializer = req.container.serializers[SubdomainName][EntityName];
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
