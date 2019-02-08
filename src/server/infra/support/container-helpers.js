export const getSubdomainsContainer = (subdomains, callback) => {
  return Object.keys(subdomains).reduce(
    (subdomainsContainer, SubdomainName) => {
      const subdomain = Object.keys(subdomains[SubdomainName]).reduce(
        (subdomainContainer, EntityName) => {
          return {
            ...subdomainContainer,
            [EntityName]: callback(
              subdomains[SubdomainName][EntityName],
              SubdomainName,
              EntityName
            ),
          };
        },
        {}
      );
      return {
        ...subdomainsContainer,
        [SubdomainName]: subdomain,
      };
    },
    {}
  );
};

export const getCommonTypesContainer = (commonTypes, callback) => {
  return Object.keys(commonTypes).reduce(
    (commonTypesContainer, CommonTypeName) => {
      return {
        ...commonTypesContainer,
        [CommonTypeName]: callback(commonTypes[CommonTypeName], CommonTypeName),
      };
    },
    {}
  );
};

export const forEachSubdomain = (subdomains, container, callback) => {
  Object.keys(subdomains).forEach((SubdomainName) => {
    Object.keys(subdomains[SubdomainName]).forEach((EntityName) => {
      callback(
        subdomains[SubdomainName][EntityName],
        container,
        SubdomainName,
        EntityName
      );
    });
  });
};
