export const getSubdomainsContainer = (entities, callback) => {
  return Object.keys(entities).reduce((entitiesContainer, SubdomainName) => {
    const subdomain = Object.keys(entities[SubdomainName]).reduce(
      (subdomainContainer, EntityName) => {
        return {
          ...subdomainContainer,
          [EntityName]: callback(
            entities[SubdomainName][EntityName],
            SubdomainName,
            EntityName
          ),
        };
      },
      {}
    );
    return {
      ...entitiesContainer,
      [SubdomainName]: subdomain,
    };
  }, {});
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

export const forEachSubdomain = (entities, container, callback) => {
  Object.keys(entities).forEach((SubdomainName) => {
    Object.keys(entities[SubdomainName]).forEach((EntityName) => {
      callback(
        entities[SubdomainName][EntityName],
        container,
        SubdomainName,
        EntityName
      );
    });
  });
};
