import container from '@container';

import Seller from './seller';
import Post from './post';
import SeniorityType from './seniority-type';

const mappersEntityToResponse = {
  SellerManagement: {
    Seller,
    Post,
    SeniorityType,
  },
};

const { mappers } = container;

export default Object.keys(mappersEntityToResponse).reduce(
  (prevSubdomainMappers, subdomainName) => {
    const subdomainMappersEntityToResponse =
      mappersEntityToResponse[subdomainName];
    const subdomainMappersModelToEntity = mappers[subdomainName];

    return {
      ...prevSubdomainMappers,
      ...Object.keys(subdomainMappersEntityToResponse).reduce(
        (prevMappers, entityName) => {
          const mapperEntityToResponse =
            subdomainMappersEntityToResponse[entityName];
          const mapperModelToEntity = subdomainMappersModelToEntity[entityName];
          return {
            ...prevMappers,
            [entityName]: (model) =>
              mapperEntityToResponse(mapperModelToEntity.toEntity(model)),
          };
        },
        {}
      ),
    };
  },
  {}
);
