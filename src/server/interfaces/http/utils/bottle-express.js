export const containerMiddleware = (container) => (req, _, next) => {
  req.container = container;
  next();
};

export const injectSerializer = (SubdomainName, EntityName) => (
  req,
  _,
  next
) => {
  req.serializer = req.container.serializers[SubdomainName][EntityName];
  next();
};

export const injectOperation = (SubdomainName, EntityName, serviceName) => (
  req,
  _,
  next
) => {
  req[serviceName] = req.container.services[SubdomainName][EntityName][
    serviceName
  ]();
  next();
};
