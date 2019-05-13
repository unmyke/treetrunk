import { lowerFirst } from 'lodash';
import seeds from './app-seeds';

const InitializeApplication = ({ subdomains, repositories }) => () =>
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
      } = { subdomains, repositories };

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
          callback({ Class: Entity, name, id });
        });
    })
  );

export default InitializeApplication;
