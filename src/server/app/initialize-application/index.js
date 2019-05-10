import { lowerFirst } from 'lodash';
import seeds from './app-seeds';

const InitializeApplication = ({ subdomains, repositories }) => () => {
  seeds.forEach(async (seed) => {
    const { name, SubdomainName, ModelName, values, callback } = seed;
    const {
      repositories: { [ModelName]: repo },
      subdomains: {
        [SubdomainName]: { [ModelName]: Entity },
      },
    } = { subdomains, repositories };

    let entity;

    entity = await repo.getOne(values);

    if (!entity) {
      const newModel = new Entity(values);
      entity = await repo.add(newModel);
    }

    const id = model[`${lowerFirst(ModelName)}Id`];

    callback({ Class: Entity, name, id });
  });
};

export default InitializeApplication;
