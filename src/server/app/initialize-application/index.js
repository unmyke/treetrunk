import { lowerFirst } from 'lodash';
import seeds from './app-seeds';

const InitializeApplication = ({
  subdomains,
  repositories,
  commonTypes,
}) => () =>
  Promise.all(
    seeds.map((seed) => {
      const { name, SubdomainName, ModelName, values, callback } = seed;
      const {
        repositories: {
          [SubdomainName]: { [ModelName]: repo },
        },
        subdomains: {
          [SubdomainName]: { [ModelName]: Entity },
        },
        commonTypes: { [`${ModelName}Id`]: EntityId },
      } = { subdomains, repositories, commonTypes };

      return repo
        .getOne(values)
        .then((entity) => {
          if (!entity) {
            const newEntity = new Entity(values);
            return repo.add(newEntity);
          }
          return entity;
        })
        .then((entity) => {
          const id = entity[`${lowerFirst(ModelName)}Id`];
          callback({ Class: EntityId, name, id });
        });
    })
  );

export default InitializeApplication;
