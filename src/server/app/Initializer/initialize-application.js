import { Operation } from '../_lib';
import { lowerFirst } from 'lodash';

export class InitializeApplication extends Operation {
  constructor({ makeValidator, subdomains, commonTypes, repositories }) {
    super({ makeValidator, commonTypes });

    this.entities = Object.keys(subdomains).reduce((acc, SubdomainName) => {
      return {
        ...acc,
        [SubdomainName]: subdomains[SubdomainName],
      };
    }, {});

    this.repositories = Object.keys(repositories).reduce(
      (acc, SubdomainName) => {
        return { ...acc, ...repositories[SubdomainName] };
      },
      {}
    );
  }

  async execute({ config }) {
    const { SUCCESS, ERROR, INITIALIZE_ERROR } = this.outputs;

    try {
      config.seeds.forEach(async (seed) => {
        const { SubdomainName, ModelName, values } = seed;
        const {
          repositories: { [ModelName]: repo },
          entities: {
            [SubdomainName]: { [ModelName]: Entity },
          },
        } = this;

        let model;

        model = await repo.getOne({ where: values });

        if (model === null) {
          const newModel = new Entity(values);
          model = await repo.add(newModel);
        }

        const id = model[`${lowerFirst(ModelName)}Id`];

        seed.callback(Entity, id);
      });
      this.emit(SUCCESS, true);
    } catch (error) {
      if (error.message === 'InitializeError') {
        return this.emit(INITIALIZE_ERROR, error);
      }

      this.emit(ERROR, error);
    }
  }
}

InitializeApplication.setOutputs(['SUCCESS', 'ERROR', 'INITIALIZE_ERROR']);